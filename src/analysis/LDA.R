library(rmongodb)
library(quanteda)
library(topicmodels)

mongo <- mongo.create(host="localhost")

# create a list with every clip in it
pretmp = mongo.find.all(mongo, "kindleclips.clippings")
tmp = mongo.find.all(mongo, "kindleclips.clippings")

# remove whitespace from author to create unique author token
for (i in 1:length(tmp)) {
      tmp[[i]]$authorCollapse <- gsub(" ", "", tmp[[i]]$author)
      tmp[[i]]$index <- i
}

# make a character vector with author, title, text elements
clips = paste(lapply(X=tmp, FUN=`[[`, 'authorCollapse'), 
         lapply(X=tmp, FUN=`[[`, 'title'), 
         lapply(X=tmp, FUN=`[[`, 'text'), sep=" ")

dfm <- dfm(clips, toLower=TRUE, removeNumbers=TRUE, removePunct=TRUE, stem=FALSE,
                ignoredFeatures=stopwords("english"))
dict <- dfm@Dimnames$features #for de-stemming words

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

for (i in 1:length(tmp)) {
      tmp[[i]]$tops <- make_tops(tops_mongo, i, 3) # set top_n at 3 to make output manageable
}

#===topic naming==
# list of collapsed author names
author.collapse = tolower(unique( lapply(X=tmp, FUN= `[[`, "authorCollapse")))

name_topic <- function(term_length, n_char, top_n_terms) {
      if (term_length > 80) { print("Watch your back. This might take awhile")}
      term = terms(lda, term_length) # pull top lda terms
      # using stem completion really slows this function down
      term = matrix(stemCompletion(as.character(term), dict), nrow=term_length)
      indx = apply(term, 2, nchar) > n_char 
      term[!indx] = NA # remove short terms
      term[term %in% author.collapse] <- NA # remove author names
      topic.names <- apply(term, 2, FUN=function(x) x[!is.na(x)][1:top_n_terms])
      topic.names }

topic.names = apply(name_topic(100, 6, 3), 2, paste, collapse='/')
names(topic.names) <- NULL

for (i in 1:length(tmp)) {
      tmp[[i]]$topicnames <- topic.names
}

# Now write the list back into mongodb
system.time(for (i in 1:length(tmp)) {
      criteria    <- pretmp[[i]][3]
      fields      <- tmp[[i]][2:length(tmp[[1]])]
      b           <- mongo.bson.from.list(lst=fields)
      crit        <- mongo.bson.from.list(lst=criteria)
      mongo.update(mongo=mongo, ns="kindleclips.tc", criteria=crit,
                   objNew=b, flags=mongo.update.basic)
} )

