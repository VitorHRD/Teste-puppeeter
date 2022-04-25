
require('dotenv').config();
const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const PORT = process.env.PORT;



async function start(){

   async function LoadMore(page , selector){
        const moreButton = await page.$(selector);
        console.log(moreButton)
        if(moreButton){
            console.log("more")
           await moreButton.click();
           await page.waitFor(selector,{timeout:3000}).catch(console.log("timeout"))
           await LoadMore(page,selector)
        }
     }


    async function getComments(page,selector){
        const comments = await page.$$eval(selector, links => links.map( link=> link.innerText))
        return comments
    }
 

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
     await page.goto('https://www.instagram.com/p/CcqpSRKu46f/')
     await LoadMore(page ,'.wpO6b')
    const comments = await getComments(page,'.MOdxS span a' )
    console.log(comments)
    
}


 start()
