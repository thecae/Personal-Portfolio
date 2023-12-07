# Personal Website

> The site is hosted at [https://cole-ellis.com](https://escaperooms.cole-ellis.com).  Please check it out! I am open to feedback :)

This is my personal website! I just did some migrations to move it from a million subdomains to just using the primary domain and then subpages. I still have a few subdomains out there for GitBook applications, but one day I'll write my own handler for those and move them to the primary domain as well.

I also wrote a Medium article outlining the deployment process of the React app on AWS EC2.  Feel free to check that out [here](https://medium.com/@echoscorpion/deploying-a-react-app-web-server-on-aws-ec2-24dd1adcb0c6)!

The site has a few sections:
* Home
* Blog - A list of escape room reviews I've written
* Portfolio - A picturesque resume of my work
* Solitaire - A solitaire game I wrote for CS4288 (Web System Architecture)

## Deployment Stack

The site is built on React and is deployed on an AWS EC2 instance. The site is served using `nginx`.  I use `pm2` to deploy the process in production mode (`npm run deploy`) and NodeJS to do local testing (`npm run start`).  The site is compiled using `esbuild` with `tailwindcss` as the styler.

Blogs are held in a static folder and are parsed using a very simple API.  The API is built using `express`.  The API is used to retrieve the list of blogs (`GET /api/blogs`) and to retrieve the content of a specific blog (`GET /api/blogs/:slug`).  In the future, I might move this to a MongoDB database, but for now, this does the trick. Each blog has a `slug` that serves as the filename of the blog, the URL of the blog, and its unique identifier.  Blogs are found by slugs.

The API for the Solitaire game uses Redis and MongoDB to store games and login states. I use MongoDB to store uses, games, and moves made; Redis is used to ensure logins across refreshes. The API is built using `express`. This site is served as a subroute of the main site using a `<Router>` object inside a `<Route>` component.

## Future Plans
I have a long list of escape rooms I have yet to review. They are all posted on my Morty profile and are sitting locally on my machine. I write notes on each of the escape rooms after I do them, but I have yet to write the full content of the blogs. I want to finally make this change to add the blogs of the rooms I've done.

In the future, I want to serve Tags that can be used to filter the blogs. I want to filter by Room Type, Location (mainly State), and difficulty. I want to add a search bar that can filter these tags, and maybe a left-side navigation bar that supports the same functionality.

## Changelog
This site had a recent migration from a static site to a dynamic site. The static site was built using basic HTML and was horribly inconvenient to make changes. I made the recent migration after learning more about web development to a React application.

The site is now a fully-dynamic Single Page Application that supports the easy addition of articles.  Articles are rendered from a Markdown file using `react-markdown`.  Since the site now has a (very light) backend, it can no longer be hosted using GitHub pages. Hence, the site is now hosted on an EC2 instance on AWS.