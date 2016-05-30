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

# indexed list of mongo IDs
id_index = lapply(X=tmp, FUN=`[[`, '_id')
# re-create tops_lst but with mongoID instead of index #s
tops_mongo = matrix(unlist(id_index)[as.numeric(tops_lst)], nrow=dim(tops_lst)[1])

# write a function that will find the top n related clips
make_tops <- function(tops_mongo, clip_number, top_n=dim(tops_mongo)[1]) {
      tops_mongo[1:top_n,clip_number]
}

# # store the top 30 most similar docs for each doc
# for (i in 1:length(tmp)) {
#       tmp[[i]]$top30 <- top_results(tops_mongo, i, top_n=30)
# }
for (i in 1:length(tmp)) {
      tmp[[i]]$tops <- make_tops(tops_mongo, i, 3) # set top_n at 3 to make output manageable
}

#===topic naming==
# list of collapsed author names
author.collapse = tolower(unique( lapply(X=tmp, FUN= `[[`, "authorCollapse")))

name_topic <- function(term_length, n_char, top_n_terms) {
      term = terms(lda, term_length) # pull top lda terms
      indx = apply(term, 2, nchar) > n_char 
      term[!indx] = NA # remove short terms
      term[term %in% author.collapse] <- NA # remove author names
      topic.names <- apply(term, 2, FUN=function(x) x[!is.na(x)][1:top_n_terms])
      topic.names }

# derive topic name from top 3 of top 1000 terms over 9 char long
topic.names = apply(name_topic(1000, 9, 3), 2, paste, collapse='/')
names(topic.names) <- NULL

for (i in 1:length(tmp)) {
      tmp[[i]]$topicnames <- topic.names
}

# Now write the list back into mongodb
for (i in 1:length(tmp)) {
      criteria    <- pretmp[[i]][3]
      fields      <- tmp[[i]][2:length(tmp[[1]])]
      b           <- mongo.bson.from.list(lst=fields)
      crit        <- mongo.bson.from.list(lst=criteria)
      mongo.update(mongo=mongo, ns="kindleclips.tc", criteria=crit,
                   objNew=b, flags=mongo.update.basic)
}
