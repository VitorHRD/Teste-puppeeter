
require('dotenv').config();
const { text } = require('express');
const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const PORT = process.env.PORT;


async function start() {
   async function LoadMore(page, selector) {
      const moreButton = await page.$(selector);
      if (moreButton) {
         console.log("more")
         await page.waitForSelector(selector)
         await moreButton.click()  
         await page.waitForSelector(selector , {timeout : 3000}).catch(()=>{
            console.log("timeout")
         })
         await LoadMore(page, selector);
      }
   }

   async function getComments(page, selector) {
      const comments = await page.$$eval(selector, (links) =>
         links.map((link) => link.innerText)
      );
      return comments;
   }

   const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
   const page = await browser.newPage();
   await page.goto("https://www.instagram.com/accounts/login/");
   await page.waitForSelector('input[name="username"]');
   await page.type('input[name="username"]', process.env.EMAIL);
   await page.type('input[name="password"]', process.env.PASSWORD);
   await page.waitForTimeout(5000);

   await page.click('button[type="submit"]');
   await page.waitForTimeout(5000);

   await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36"
   );
   await page.goto(process.env.URL);
   await LoadMore(page, 'svg[aria-label="Carregar mais comentários"]');
   const comments = await getComments(page, ".C4VMK ");
   console.log(comments)
   const sorted = sort(comments)
   const counted = count(comments)
   const winner = counted.find((comment)=>{return comment.id == sorted})
   console.log(winner)
   await browser.close()
}

start()



function sort (array){
   let length = Math.floor(Math.random() * array.length)

   return length
}

function count(comments){
   const count = [];
   let i = 1 ;
   comments.forEach(comment=>{count.push({text: comment , id : i++ })})
   return count
}