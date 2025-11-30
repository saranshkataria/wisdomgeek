---
title: 'Natural Language Processing &#8211; A 30,000 feet view'
description: 'Natural Language Processing has gained a lot of popularity owing to an exponential increase in unstructured data generation. Here are some fun data to give you context – The world sees 682 million tweets per day There exists 1.2 million new data producing social media users each day Up to&#46;&#46;&#46;'
pubDate: 'Nov 24, 2020'
heroImage: './hero.jpg'
categories: ["Data Science","Machine Learning"]
---

Natural Language Processing has gained a lot of popularity owing to an exponential increase in unstructured data generation. Here are some fun data to give you context – 

- The world sees 682 million tweets per day
- There exists 1.2 million new data producing social media users each day
- Up to 80% of the data on the Internet is unstructured

From the above facts, it is fair to say that the internet generates a lot of unstructured/semi-structured data ranging from tweets to Facebook and YouTube comments, newspaper articles, and other text-heavy research papers. Additionally, owing to the pandemic, brands have now started to focus their attention online. Consequently, analyzing reviews, comments, and engaging with the audience regularly has become paramount to build brand equity and ensure a positive consumer sentiment.

Working on structured data formats is easy because we know the schema and format. The data is clean and free from any anomalies. However, there are a lot of constraints when it comes to raw data. Some of them are – 

- Inconsistent data (no clear schema/pattern)
- Data is not clean (may contain emojis and special characters)
- It can be conversational (deriving context can be tough)

To deal with the challenges mentioned above, we use Natural Language Processing. In this article, we will try and understand the basics of NLP, what steps are involved and how can we use machine learning algorithms to derive relevant insights from the data.

So without any further ado, let us begin.

## What is Natural Language Processing or NLP?

It is a branch of artificial intelligence that aims to understand the interactions between computers and human language. Particularly, how to process and analyze large amounts of natural language data. Some of the most common use-cases of NLP are – 

- Sentiment analysis
- Text classification
- Chat-bots and virtual assistants
- Speech recognition

A basic NLP model involves the following broad steps – 

1. $1
2. $1
3. $1
4. $1

Let us understand each one of them in detail.

### 1: Data Cleaning

As mentioned earlier, raw data on the internet comes in various shapes and sizes. As is the case with several tweets and YouTube comments, there can be a lot of punctuations, stop-words, short-hands and emojis in the text. For example, here is one of the comments from a video on YouTube.

"Of course D and what was that? Film editing software ✂️🤣😂🤣😂😂🤣🤣😂🤣"

It is clear from the comment above, that a lot of the information in the comment is irrelevant, that is, it does not add any value to the meaning of the sentence. This needs to be chopped off to build a machine learning model. This process is called cleaning the data and generally includes removing the following – 

- Stop-words (A, and, the etc)
- Punctuations (commas, exclamation mark)
- Special characters (@ and emojis)

### 2: Stemming/Lemmatization

The next step in the process is to find the root of the word in order to avoid redundancy. Consider the following 2 statements – 

- I am running with great speed
- I run with a great speed

After removing all the stop-words from the sentence above, we get &#8216;run', &#8216;running', &#8216;great', &#8216;speed'. If you notice closely, the word &#8216;run' and &#8216;running' both means the same thing in the given context. Hence, our model need not consider them as two separate words. This is where stemming/lemmatization comes into the picture. Both the processes involve picking the root word from a given word. This helps us reduce the number of words to analyze. 

However, there is a catch. Lemmatization is considered better than stemming because stemming simply chops off the letters other than the root word, irrespective of whether the word exists in the language or not. Lemmatization, on the other hand, understands the context in which the word is used and hence, restores the root of the word actually found in the language. 

For example, consider two words – **boats **and **boating**. Performing stemming would result in the same root word – **Boat**. Whereas lemmatization will produce two root words – **Boat** and **Boating**. Similarly, for mouse and mice, stemming will yield **mouse **and **mice**, but lemmatization will yield **mouse**

There are several ways to perform stemming. Some of the most commonly used stemming methods are Porter Stemmer and Snowball stemmer.

### 3: Vectorization

Once we have cleaned data, free from all the punctuation and stop-words in its root word, we then vectorize the words. Simply put, vectorization is the process of converting a string of characters into a computer-understandable language. Since computer cannot understand a string of characters, it needs to be converted to numbers. Basic methods include – 

1. $1
2. $1
3. $1

There are more sophisticated algorithms to perform vectorization on text data. This includes **Word2Vec **and **Doc2Vec**. For the scope of this article, we will not deep-dive into how each of them functions. However, we plan to cover it in the articles to come. 

### 4: ML Model Implementation

At the end of step 3, we will have a dataframe (or a N-dimensional feature vector) that can be used as an input to the machine learning model. It is up to the data scientist to choose a machine learning algorithm that best fits the use case. For example, if the problem statement is to classify whether a given email is SPAM or not, one can use random forest or decision trees to classify data. 

Hurray, we have reached to the end of the article. 

This article aims to familiarize you with the concept of NLP. The field of NLP is very vast and the article does not cover even a small portion of it. I do not claim to be entirely accurate in the description of the concepts either. I have tried to put my understanding into words for you to benefit from it. This article is enough to understand the overall schema of how NLP works, what is the process.

If you want a more in-depth article on some of the topics mentioned above, do let us know in the comment section below.

Until next time, keep learning!
