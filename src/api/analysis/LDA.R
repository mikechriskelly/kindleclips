#!/usr/bin/env Rscript
args = commandArgs(trailingOnly=TRUE)

library(tm)
library(RPostgreSQL)
library(quanteda)
library(topicmodels)

host <- "localhost"
port <- 5432
user <- "christophercastle"
dbname <- "christophercastle"
pw <- "password"
userid <- "userid"

# loads the PostgreSQL driver
drv <- RPostgreSQL::PostgreSQL()

con <- dbConnect(drv, dbname = dbname,
                 host = host, port = port,
                 user = user)

# query to extract only clips for a single user
# tmp2 <- dbGetQuery(con, "select * from \"Clip\" where \"userId\" = 'e9579f90-3bfc-11e6-9c95-c79599221550'::uuid")
# dbGetQuery(con, "select title from \"Clip\" where author = 'Seth Godin'")

# extract the entire Clip table, for localhosting only
tmp <- dbReadTable(con, "Clip")

# create collapsed author, title, text vector
clips <- paste(tmp$title, gsub(" ", "", tmp$author), tmp$text)

dfm <- dfm(clips, toLower = TRUE, removeNumbers = TRUE, removePunct = TRUE, stem = FALSE,
                ignoredFeatures = stopwords("english"))
dict <- dfm@Dimnames$features #for de-stemming words

dfm <- dfm(clips, toLower = TRUE, removeNumbers = TRUE, removePunct = TRUE, stem = TRUE,
                ignoredFeatures = stopwords("english"))

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
k <- make_k(tmp) # number of topic clusters
set.seed(10)
lda <- LDA(x = dfm, k = k, method = "Gibbs", control = list(verbose = 800, alpha = 50/k, seed = 10)) # make the LDA model

#### method to create gammaDF for new documents using an existing LDA model
# lda_inf <- posterior(ldaModel, NewDoc.dfm)
# new.gammaDF <- lda_inf$topics

# pull topic probs for each clip and put them into tmp list
gammaDF <- as.data.frame(lda@gamma)
# use Hellinger distance for similarity measure of vectors
dist.mat <- as.matrix(dist(gammaDF), method = "Bhjattacharyya")

gammaDF <- round(gammaDF, 6)

topicProbs <- split(as.matrix(gammaDF), 1:NROW(gammaDF))

# sorted similarity matrix for all clips
tops_lst <- apply(dist.mat, 2, function(x) names(sort(x)[2:dim(dist.mat)[1]]))

# re-create tops_lst but with mongoID instead of index #s
tops_id <- matrix(tmp$id[as.numeric(tops_lst)], nrow = dim(tops_lst)[1])

# write a function that will find the top n related clips
make_tops <- function(tops_id, clip_number, top_n=dim(tops_id)[1]) {
      tops_id[1:top_n,clip_number]
}

simClips <- list()
for (i in 1:NROW(tmp)) {
      simClips[[i]] <- make_tops(tops_id, i, 3) # set top_n at 3 to make output manageable
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

topic.names <- apply(name_topic(60, 6, 5), 2, paste, collapse = '_') # there must be a faster way to do this
names(topic.names) <- NULL

# hacky way to put arrays into sql as char vectors in R
topic.names <- paste("'", topic.names, "'", sep = "")
topic.names <- paste("{", paste(topic.names, collapse = ", "), "}")
topic.namesDAT <- data.frame("userId" = tmp$userId[1], "topicNames" = topic.names)

# hacky function to make lists into array looking char vectors
make_string_array <- function(lst) {
      char <- NULL
      for (i in 1:length(lst)) {
            char[i] <- paste("{", paste(paste("'", as.character(lst[[i]]), "'", sep = ""), collapse = ", "), "}")
      }
      char
}

tmp$topicProbs <- make_string_array(topicProbs)
tmp$simClips <- make_string_array(simClips)

# dbListTables(con)
# 
# # create a new table, this function doesn't work for updating
# dbWriteTable(con, "test",
#              value = topic.namesDAT, row.names = FALSE)

test <- dbReadTable(con, "test")
