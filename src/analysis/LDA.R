require(tm)
require(SnowballC)
require(RTextTools)
require(topicmodels)
library(proxy)

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

# use Hellinger distance for similarity measure of vectors
dist.mat = as.matrix(dist(gammaDF), method = "Bhjattacharyya")

# sorted similarity matrix for all clips
tops_lst = apply(dist.mat, 2, function(x) names(sort(x)[2:dim(dist.mat)[1]]))

# write a function that will find the top n related clips
top_results <- function(tops_lst, clip_number, top_n) {
      # for(i in 1:dim(distance_matrix)[1]) { tops_lst[[i]] = sort(dist.mat[,i])[2:(top_n+1)]}
      # as.integer(names(tops_lst[[clip_number]]))
      as.integer(tops_lst[1:top_n,clip_number])
}

top_results(tops_lst=tops_lst, clip_number=450, top_n=6)
