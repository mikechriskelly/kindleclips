library(rmongodb)
library(quanteda)
library(topicmodels)

mongo <- mongo.create(host="localhost")

# create a list with every clip in it
tmp = mongo.find.all(mongo, "kindleclips.clippings")

# remove whitespace from author to create unique author token
for (i in 1:length(tmp)) {
      tmp[[i]]$authorCollapse <- gsub(" ", "", tmp[[i]]$author)
      tmp[[i]]$index <- i
}

# make a character vector with author, title, text elements
clips <- NULL
for (i in 1:length(tmp)) {
      clips[i] <- paste(c(tmp[[i]]$authorCollapse, tmp[[i]]$title, tmp[[i]]$text), collapse=" ")
}

dfm <- dfm(clips, toLower=TRUE, removeNumbers=TRUE, removePunct=TRUE, stem=TRUE,
                ignoredFeatures=stopwords("english"))
k <- 12 # number of topic clusters
lda <- LDA(x=dfm, k=k, method="Gibbs", control = list(verbose=800, alpha=50/k, seed=10)) # make the LDA model

# pull topic probs for each clip and put them into tmp list
gammaDF <- as.data.frame(lda@gamma)
# use Hellinger distance for similarity measure of vectors
dist.mat = as.matrix(dist(gammaDF), method = "Bhjattacharyya")

gammaDF <- round(gammaDF, 6)
for (i in 1:length(tmp)) {
      tmp[[i]]$topicprobs <- gammaDF[i,]
}

# sorted similarity matrix for all clips
tops_lst = apply(dist.mat, 2, function(x) names(sort(x)[2:dim(dist.mat)[1]]))

# write a function that will find the top n related clips
top_results <- function(tops_lst, clip_number, top_n) {
      as.integer(tops_lst[1:top_n,clip_number])
}

# store the top 30 most similar docs for each doc
for (i in 1:length(tmp)) {
      tmp[[i]]$top30 <- top_results(tops_lst, i, top_n=30)
}
# # Nullify the collapsed author element
# for (i in 1:length(tmp)) {
#       tmp[[i]]$authorCollapse <- NULL
# }

# Now write the list back into mongodb
for (i in 1:length(tmp)) {
      criteria    <- pretmp[[i]][3]
      fields      <- tmp[[i]][2:8]
      b           <- mongo.bson.from.list(lst=fields)
      crit        <- mongo.bson.from.list(lst=criteria)
      mongo.update(mongo=mongo, ns="kindleclips.tc", criteria=crit,
                   objNew=b, flags=mongo.update.basic)
}

#=================
#===topic naming==
# list of collapsed author names
author.collapse = NULL
for (i in 1:length(tmp)) {
      author.collapse[i] = tmp[[i]][5]
}
author.collapse = tolower(unique(author.collapse))

term 	= terms(lda, 1000)
nchar 	= 6
indx 	= apply(term, 2, nchar) > n_char
term[!indx] = NA
term[term %in% author.collapse] <- NA
# topic name based on top 3 words over n characters in length
topic.names = NULL
for (i in 1:dim(term)[2]) {
      topic.names[[i]] = term[!is.na(term[,i]), i][1:3]
}
