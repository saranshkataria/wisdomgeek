---
title: 'Converting a business problem to a machine learning problem'
description: 'Businesses these days are generating and consuming a huge amount of data. This data varies in variety, volume, velocity, and veracity (4Vs of big data). Consequently, this trend has led to organizations'' rapid adoption of different AI and ML tools and techniques. Hence, converting a business problem to a machine&#46;&#46;&#46;'
pubDate: 'Jan 05, 2021'
heroImage: './hero.jpg'
categories: ["Data Science","Machine Learning"]
categoryHierarchy: ["Development","Data Science"]
---

Businesses these days are generating and consuming a huge amount of data. This data varies in variety, volume, velocity, and veracity (4Vs of big data). Consequently, this trend has led to organizations' rapid adoption of different AI and ML tools and techniques. Hence, converting a business problem to a machine learning problem has started becoming a challenging task. It is crucial to understand that not all business problems can be solved through ML. And for situations where an ML solution could be used, it may not always be appropriate to do so. In cases where an ML solution would be appropriate, understanding the underlying business drivers will help you more clearly define and articulate the technical solution.

In this article, I would like to walk you through the steps to identify business problems that can be solved through ML. So without any further ado, let us begin our approach towards converting a business problem to a machine learning problem-

## **Describe the problem in plain language**

Yes, that is right. Writing down the problem in simple, direct words requires thinking through what really needs to be accomplished. In my personal experience, you get many doubts (and subsequently clarity) when you start writing the problem. There are several questions that immediately pop-up in your mind.

## **Identify the ideal outcome**

Regardless of the model you use, identify what business outcome you are trying to achieve. At the end of the model building process, you should have a business-ready solution. The solution should be able to solve the problem described in the step above.

## **Define your success metrics**

No, I am not talking about accuracy, RMSE, or F-1 score. The success metric should be focused on business, addressing the ideal outcome you identified earlier.

How will you determine if the machine learning model fails to live up to business requirements? How will you know it has succeeded?

The metrics you identify should be measurable, specific, and attainable and should specify timeframes. Owing to the business's evolving nature, these metrics can change even during the model building phase. Hence, it is necessary to stay abreast of all the latest developments in the domain of the business.

## **Define the ideal output**

Again, writing down a description of the desired output will help you clarify what you are really looking for. The output should be quantifiable, something that a machine learning algorithm can actually predict. For example, it might not be able to quantify a customer's degree of happiness.  But it might be able to predict the likelihood that a customer will give the social media site a "thumbs up." It may also predict whether a customer will recommend a product to another customer.

## **Identify where the data will come from**

Machine learning is heavily dependent on data. To train a predictive model, you must obtain historical data representing the outputs you want to predict.  Some manipulation of existing data is possible. However, if you cannot obtain the right data, you may need to reformulate your ML problem using data you can obtain.

## **Determine when and how the inputs and output will be used**

Practical considerations of when input data is available and when output data must be produced may impact the design of your solution. For example, input data that your solution depends on may be released in batches once a month. If a solution based on month-old data will not suffice, then you'll need to reconsider the solution.

## **Identify ways the problem might be solved without ML**

Brainstorming ways to solve the problem without using ML will help you focus on the business logic and might lead you to simpler, more elegant solutions, even if you do end up using an ML solution.

## **Formulate the problem as an ML problem**

From a business perspective, you have already identified the type of outcome you need to produce. Now consider how to express that outcome in terms of various outcomes a machine learning model might produce. For example, regression, classification, clustering, and so forth. While you may eventually end up using an advanced machine learning model, simpler models are easier to think through and implement. So initially, try to see if you can find a simple way to cast the problem. For example, "predict the optimum selling price for a particular house" (regression). Or "recommend houses that a particular buyer might want to purchase" (classification).

That brings us to the end of this article. I hope these points will help you in converting a business problem to a machine learning problem for your organization. Or at least provide you with a framework to think about how to frame the business problem into a machine learning problem. You can check out our other [machine learning](https://www.wisdomgeek.com/development/machine-learning/) related articles for related posts as well.
