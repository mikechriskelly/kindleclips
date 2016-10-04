#!/usr/bin/env Rscript
args = commandArgs(trailingOnly = TRUE)

library(tm)
library(RPostgreSQL)
library(quanteda)
library(topicmodels)
library(uuid)

userid      <- args[1]
dbname      <- args[2]
host        <- args[3]
port        <- args[4]
user        <- args[5]
pw          <- args[6]

# loads the PostgreSQL driver
drv <- RPostgreSQL::PostgreSQL()

con <- dbConnect(drv, dbname = dbname,
                 host = host, port = port,
                 user = user)

# query to extract only clips for a single user
qry <- paste("select id, user_id, hash, title, author, text from clip where user_id =", paste("'", userid, "'", "::uuid", sep = ""))
tmp <- dbGetQuery(con, qry)

# create collapsed author, title, text vector
clips <- paste(tmp$title, gsub(" ", "", tmp$author), tmp$text)

dfm <- dfm(clips, toLower = TRUE, removeNumbers = TRUE, removePunct = TRUE,
           stem = FALSE, ignoredFeatures = stopwords("english"))
dict <- dfm@Dimnames$features #for de-stemming words

dfm <- dfm(clips, toLower = TRUE, removeNumbers = TRUE, removePunct = TRUE,
           stem = TRUE, ignoredFeatures = stopwords("english"))

# simple, nonlinear function to keep x within an interpretable range
make_k <- function(tmp) {
      ua <- length(unique(tmp$author))
      ut <- length(unique(tmp$title))
      x <- (ua ^ 2 + ut ^ 2) ^ (1/4)
      x <- ifelse(x > 25, 25, x)
      x <- ifelse(x < 5, 5, x)
      round(x, 0)
}
k_tops <- make_k(tmp) # number of topic clusters
topic_len <- 1:k_tops

# make the LDA model using VEM method, Gibbs provides more even topic distribution
set.seed(10)
lda <- LDA(x = dfm, k = k_tops, control = list(alpha = 50/k_tops, seed = 10))

#### method to create gamma_df for new documents using an existing LDA model
# lda_inf <- posterior(ldaModel, NewDoc.dfm)
# new.gamma_df <- lda_inf$topics

# pull topic probs for each clip and put them into gamma df
gamma_df <- as.data.frame(lda@gamma)

# use Hellinger distance for similarity measure of vectors
dist_mat <- distHellinger(as.matrix(gamma_df))
dist_mat <- dist_mat * 1000
gamma_df <- round(gamma_df, 6)

# create normalized clip similarity table
dist_vec <- as.vector(dist_mat)
id_dist_vec <- rep(tmp$id, times = 1, each = NROW(tmp))
sim_id_vec <- rep(tmp$id, times = NROW(tmp))
clip_dist_table <- data.frame(
                  "user_id" = userid,
                  "clip_dist_key" = paste(id_dist_vec, sim_id_vec, sep = "-"),
                  "clip_id" = id_dist_vec,
                  "sim_clip_id" = sim_id_vec, 
                  "distance" = dist_vec, stringsAsFactors = FALSE)
rem <- which(clip_dist_table$distance == 0)
clip_dist_table <- clip_dist_table[-rem, ]

# apply a threshold (90th percentile) to clip_dist and reduce to n top relationships
make_smaller_table <- function(table, n) {
      thresh <- which(table$distance < quantile(table$distance, 0.1))
      table <- table[thresh, ]
      clip_array <- split(table, table$clip_id)
      clip_array <- lapply(clip_array, function(x) x[order(x$distance)[1:n],])
      df <- do.call(rbind, lapply(clip_array, data.frame, stringsAsFactors = FALSE))
      df
}

clip_dist_table <- make_smaller_table(clip_dist_table, 10)

# create normalized topic probability table
topic_prob_table <- data.frame(
      "user_id" = userid,
      "prob" = as.vector(t(gamma_df)), # topic probability vector
      "topic_id" = rep(topic_len, NROW(tmp)), # repeating topic id vector
      "clip_id" = rep(tmp$id, times = 1, each = k_tops), # repeating clip id vector
      stringsAsFactors = FALSE )

# topic naming
# list of collapsed author names
author_collapse <- tolower(unique(gsub(" ", "", tmp$author)))

name_topic <- function(term_length, n_char, top_n_terms) {
      term <- terms(lda, term_length) # pull top lda terms
      # using stem completion really slows this function down
      term <- matrix(stemCompletion(as.character(term), dict), nrow = term_length)
      indx <- apply(term, 2, nchar) > n_char 
      term[!indx] <- NA # remove short terms
      term[term %in% author_collapse] <- NA # remove author names
      topic_names <- apply(term, 2, FUN = function(x) x[!is.na(x)][1:top_n_terms])
      topic_names }

topic_names <- apply(name_topic(35, 6, 3), 2, paste, collapse = '_') # there must be a faster way to do this

# create normalized table with topic names
topic_names_table <- data.frame(
                        "user_id" = userid, 
                        "topic_id" = topic_len,
                        "name" = topic_names, 
                        stringsAsFactors = FALSE)

make_batch_insert <- function(df, col_1, col_2, col_3, col_4, table_name) {
      if (missing(col_4)) {
            txt <- sapply(1:nrow(df), function(x)
                  paste("('", UUIDgenerate(), "',",
                        "'", df[[col_1]][x], "',",
                        "'", df[[col_2]][x], "',",
                        "'", df[[col_3]][x], "',",
                        "'", Sys.time(), "',",
                        "'", Sys.time(), "')",
                        sep = ""))
            if (class(txt) != 'character') {
                  stop("Output class must be character", call. = FALSE)
            }
            txt <- paste(txt, collapse = ", ")
            txt <- paste("insert into", table_name,  "(id, ", col_1, ",", col_2, ",", col_3, ",", "created_at, updated_at) values", txt)
            txt
      } else {
            txt <- sapply(1:nrow(df), function(x)
                  paste("('", UUIDgenerate(), "',",
                        "'", df[[col_1]][x], "',",
                        "'", df[[col_2]][x], "',",
                        "'", df[[col_3]][x], "',",
                        "'", df[[col_4]][x], "',",
                        "'", Sys.time(), "',",
                        "'", Sys.time(), "')",
                        sep = ""))
            if (class(txt) != 'character') {
                  stop("Output class must be character", call. = FALSE)
            }
            txt <- paste(txt, collapse = ", ")
            txt <- paste("insert into", table_name,  "(id, ", col_1, ",", col_2, ",", col_3, ",", col_4, ",", "created_at, updated_at) values", txt)
            txt
      }
}

# create the insert into queries
name_txt <- make_batch_insert(topic_names_table, col_1 = "user_id", col_2 = "topic_id", col_3 = "name", table_name = "topic")
prob_txt <- make_batch_insert(topic_prob_table, "clip_id", "topic_id", "prob", "user_id", "topic_prob")
dist_txt <- make_batch_insert(clip_dist_table, "clip_id", "sim_clip_id", "distance", "user_id", "clip_dist")

# write everything into Postgres
dbGetQuery(con, name_txt)
dbGetQuery(con, prob_txt)
dbGetQuery(con, dist_txt)

# shut db connection
dbDisconnect(con)
