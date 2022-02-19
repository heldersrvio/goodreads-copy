# Goodreads Copy

![Home screen](https://i.imgur.com/oNaAGLQ.png)

A small-scaled copy of Goodreads using React.

The goal was to make a copy of a well-known social-media-like platform and I chose Goodreads because not only I used it often, but it also seemed more interesting than Facebook, Twitter or Reddit, which had been done hundreds of times by other people already.

You can sign up, add books to your shelf as either 'reading', 'read' or 'to-read', rate them and recommend them to other people. You can find information about a specific book by visiting its page, as well as information about is author(s) by visiting their pages. You can also add new books to the database and create custom shelves for your books.

There are many other functionalities, certainly not to the extent of the [real Goodreads](https://www.goodreads.com), but a reasonable amount that covers the main use cases for the website.

This project took me a really long time and it was very challenging. First, because of how massive the real Goodreads is and, given that my original intention was to cover a lot more pages and functionalities, how much time it would take for a single person to write all that. Second, because I relied exclusively on Firebase for my back-end services (having little knowledge of how back-ends worked at the time), using that for such a complex concept that Goodreads is (with tons of different tables and relations between them) was less than ideal and turned out to be a mess. I suppose using a NoSQL database for something like this is just not a good idea (but who knows, maybe it was just due to my lack of experience). And third, lack of modularity made me type a lot more than I should have.

With that in mind, despite its multiple shortcomings, this project has given me a lot of experience, especially with ReactJS and more complex CSS layouts that require some imagination if you're not experienced.

[Check out the live version](https://heldersrvio.github.io/goodreads-copy/).

## Running it locally

Make sure Node is installed in your machine and then run ``npm install`` to install the project's dependencies, followed by ``npm start`` to run it.
