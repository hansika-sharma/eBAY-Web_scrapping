const url = "https://www.ebay.com/";
const request = require("request");
const cheerio = require("cheerio");

const pdf = require("pdfkit");
const fs = require("fs");

let count=1;
console.log("before");
request(url, cb);

function cb(err, response, html) {
    if(err) {
        console.log(err);
    } else {
        extractHTML(html);
        //console.log(html);
    }
}

function extractHTML(html) {
    let $ = cheerio.load(html);
    let elemnet = $("a[href='https://www.ebay.com/b/Electronics/bn_7000259124']");
    let link = elemnet.attr("href");
    //console.log(link);
    request(link, cb1)
}

function cb1(err, response, html){
    if(err){
        console.log(err)
    } else{
        //console.log(html);   
        getCategory(html)
    }
}
function getCategory(html) {
    let $ = cheerio.load(html);
    let Element = $(".b-textlink.b-textlink--parent");
    for(let i=1 ; i<=10; i++){
        let link = $(Element[i]).attr("href");
        //console.log(link);
        let Linkvalid =  CheckLink(link);
        if(Linkvalid){
            request(link, cb2);
        }
    }
    
}
function CheckLink(link){
    let splitlink = link.split("/");
    let finalSplit = splitlink[4].split("-");
    // console.log(finalSplit);
    if(finalSplit[0]=='Video'){
        return false;
    }
    else if(finalSplit[0] == 'Cell'){
        return false;
    }
    else if(finalSplit[0]=='Computers'){
        return false;
    }
    else{
        return true;
    }
}
function cb2(err, response, html){
    if(err){
        console.log(err);
    }else{
        //console.log(html);
        getData(html);
    }
}

function getData(html){
    let $ = cheerio.load(html);
    let data = $("a[target='_blank'] h3");
    let price = $(".s-item__price");
    let link = $("a[target='_blank']")
    let FinalData = "";
    for(let j=0;j<48;j++){
        let ContentData = $(data[j]).text();
        let ContentPrice = $(price[j]).text();
        let ContentLink = $(link[j*2]).attr("href");
        console.log(`Product${j+1} : ${ContentData} ---- Price : ${ContentPrice} ---- Link : ${ContentLink}`);

        // console.log("\n");

        FinalData += "PRODUCT"+(j+1)+" :- "+ContentData+'\n'+"PRICE :- "+ContentPrice+'\n'+"LINK :- "+ContentLink+'\n\n\n';  
        // console.log(FinalData);

    }
    let pdfdoc = new pdf
    let FileName = `data${count}.pdf`
    count++;
    pdfdoc.pipe(fs.createWriteStream(FileName))
    pdfdoc.text(FinalData)
    pdfdoc.end();

    

    console.log("---------------------------*-------------------------");
    //console.log('\n');
}
console.log("After");















