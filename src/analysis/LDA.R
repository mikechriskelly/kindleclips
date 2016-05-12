require(tm)
require(SnowballC)
require(RTextTools)
require(topicmodels)

# set your own dir
setwd("/Users/christophercastle/Documents/Kindle Proj")

# connect to mongodb
mongo = mongo.create(host = "localhost")
mongo.is.connected(mongo)
DBNS = 'kindleclips.clippings'
mongo.count(mongo, ns =DBNS)
all <- mongo.find.all(mongo, DBNS) #import clippings collection into R

# take text from mongo list and make a char. vector
txt <- NULL
for (i in seq_len(length(all))) {
      txt[i] <- all[[i]]$text
}

# make the corpus
mat <- create_matrix(txt, language="english", removeNumbers = TRUE, removeStopwords = TRUE, 
                     stemWords = TRUE, weighting = weightTf)

k <- 11 # number of topic clusters

lda <- LDA(mat, k) # make the LDA model

terms(lda, 15) # Top 15 most likely terms for each Topic cluster

# make a dataframe with the topic cluster probability for each document
gammaDF <- as.data.frame(lda@gamma)
head(round(gammaDF, 2))
