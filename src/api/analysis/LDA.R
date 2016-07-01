#!/usr/bin/env Rscript
args = commandArgs(trailingOnly = TRUE)

library(tm)
library(RPostgreSQL)
library(quanteda)
library(topicmodels)

timeChk <- Sys.time()

host <- "localhost"
port <- 5432
user <- "christophercastle"
dbname <- "christophercastle"
pw <- "password"

# loads the PostgreSQL driver
drv <- RPostgreSQL::PostgreSQL()

con <- dbConnect(drv, dbname = dbname,
                 host = host, port = port,
                 user = user)

# query to extract only clips for a single user
userid <- 'e9579f90-3bfc-11e6-9c95-c79599221550' # user arg fun to pull clips for specific user
qry <- paste("select id, \"userId\", hash, title, author, text from \"Clip\" where \"userId\" =", paste("'", userid, "'", "::uuid", sep = ""))
tmp <- dbGetQuery(con, qry)
# dbGetQuery(con, "select title from \"Clip\" where author = 'Seth Godin'")

# extract the entire Clip table, for localhosting only
# tmp <- dbReadTable(con, "Clip")

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
      # x <- log((ut+ua)^exp(1))
      # x <- (ua+ut)/16
      x <- (ua ^ 2 + ut ^ 2) ^ (1/4)
      ifelse(x > 25, 25, x)
      ifelse(x < 5, 5, x)
      round(x, 0)
}
k_tops <- make_k(tmp) # number of topic clusters
topic_len <- 1:k_tops

set.seed(10)
# lda.gibbs <- LDA(x = dfm, k = k, method = "Gibbs", control = list(verbose = 800, alpha = 50/k, seed = 10)) # make the LDA model
lda <- LDA(x = dfm, k = k_tops, control = list(verbose = 800, alpha = 50/k_tops, seed = 10))# make the LDA model
#### method to create gammaDF for new documents using an existing LDA model
# lda_inf <- posterior(ldaModel, NewDoc.dfm)
# new.gammaDF <- lda_inf$topics

# pull topic probs for each clip and put them into tmp list
gammaDF <- as.data.frame(lda@gamma)
# use Hellinger distance for similarity measure of vectors
# can this be made to vector w/o breaking anything? distMat <- as.matrix(dist(gammaDF), method = "Bhjattacharyya")
gammaDF <- round(gammaDF, 6)

# create normalized clip similarity table
distVec <- as.vector(distMat)
idDistVec <- rep(tmp$id, times = 1, each = NROW(tmp))
simIdVec <- rep(tmp$id, times = NROW(tmp))
clip_dist_table <- data.frame(
                  "clip_dist_key" = paste(idDistVec, simIdVec, sep = "-"),
                  "clip_id" = idDistVec,
                  "clip_dist_id" = simIdVec, 
                  "distance" = distVec, stringsAsFactors = FALSE)
rem <- which(clip_dist_table$distance == 0)
clip_dist_table <- clip_dist_table[-rem, ]

make_smaller_table <- function(table, n) {
      clip_array <- split(table, table$clip_id)
      clip_array <- lapply(clip_array, function(x) x[order(x$distance),])
      df <- data.frame()
      for (i in 1:NROW(clip_array)) {
            df <- rbind(df, clip_array[[i]][1:n,])
      }
      df
}

top_30 <- make_smaller_table(clip_dist_table, 30)

# create normalized topic probability table
topic_prob_table <- data.frame(
      "topic_prob" = as.vector(t(gammaDF)), # topic probability vector
      "topic_id" = rep(topic_len, NROW(tmp)), # repeating topic id vector
      "clip_id" = rep(tmp$id, times = 1, each = k_tops), # repeating clip id vector
      stringsAsFactors = FALSE )

# write a function that will find the top n related clips
make_tops <- function(tops_id, clip_number, top_n=dim(tops_id)[1]) {
      tops_id[1:top_n,clip_number]
}


#===topic naming==
# list of collapsed author names
author.collapse <- tolower(unique(gsub(" ", "", tmp$author)))

name_topic <- function(term_length, n_char, top_n_terms) {
      if (term_length > 80) { print("Watch your back. This might take awhile")}
      term <- terms(lda, term_length) # pull top lda terms
      # using stem completion really slows this function down
      term <- matrix(stemCompletion(as.character(term), dict), nrow = term_length)
      indx <- apply(term, 2, nchar) > n_char 
      term[!indx] <- NA # remove short terms
      term[term %in% author.collapse] <- NA # remove author names
      topic.names <- apply(term, 2, FUN = function(x) x[!is.na(x)][1:top_n_terms])
      topic.names }

topic.names <- apply(name_topic(35, 6, 3), 2, paste, collapse = '_') # there must be a faster way to do this
names(topic.names) <- NULL

# create normalized table with topic names
topic_names_table <- data.frame(
                        "user_id" = tmp$userId[1], 
                        "topic_id" = topic_len,
                        "topic_names" = topic.names, 
                        stringsAsFactors = FALSE)

# dbRemoveTable(con, "topic_name")
# dbRemoveTable(con, "topic_prob")
# dbRemoveTable(con, "clip_dist")

# initialize topic_name table
dbWriteTable(con, "topic_name", value = topic_names_table[1,], row.names = FALSE)
# insert addtional rows into table
for (i in 2:NROW(topic_names_table)) {
      txt <- paste("insert into topic_name (topic_key, user_id, topic_id, topic_names) values",
                   "('", topic_names_table$topic_key[i], "',",
                   "'", topic_names_table$user_id[i], "',",
                   "'", topic_names_table$topic_id[i], "',",
                   "'", topic_names_table$topic_names[i], "')",
                   sep = "")
      dbGetQuery(con, txt)
}

# initialize topic_prob table
dbWriteTable(con, "topic_prob", value = topic_prob_table[1,], row.names = FALSE)
# insert addtional rows into table
for (i in 2:NROW(topic_prob_table)) {
      txt <- paste("insert into topic_prob (prob_key, clip_id, topic_id, topic_prob) values",
                   "('", topic_prob_table$prob_key[i], "',",
                   "'", topic_prob_table$clip_id[i], "',",
                   "'", topic_prob_table$topic_id[i], "',",
                   "'", topic_prob_table$topic_prob[i], "')",
                   sep = "")
      dbGetQuery(con, txt)
}

# initialize clip_dist table
clip_dist_table <- top_30
dbWriteTable(con, "clip_dist", value = clip_dist_table[1,], row.names = FALSE)
# insert addtional rows into table
for (i in 2:NROW(clip_dist_table)) {
      txt <- paste("insert into clip_dist (clip_dist_key, clip_id, clip_dist_id, distance) values",
                   "('", clip_dist_table$clip_dist_key[i], "',",
                   "'", clip_dist_table$clip_id[i], "',",
                   "'", clip_dist_table$clip_dist_key[i], "',",
                   "'", clip_dist_table$distance[i], "')",
                   sep = "")
      dbGetQuery(con, txt)
}

print(Sys.time() - timeChk)

# dbListTables(con)
