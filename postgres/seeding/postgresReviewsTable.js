//Bring in Dependencies
const db = require('../index.js');
const fs = require('fs');
const csvWriter = require('csv-write-stream');
let writer = csvWriter();
const faker = require('faker');
const colors = require('colors');
var EventEmitter=require('events').EventEmitter;
EventEmitter.defaultMaxListeners=20;
//Init counter's
let counter = 1;
let res_id = 1;


//Helper functions
const randomBool = (num = Math.floor(Math.random() * 10)) => num % 2 === 0 ? true : false;

//Seeding Function
//Seeding Function
const main = async () => {
  console.log(`Total Stack --> ${res_id}`.rainbow);
  const createReviewsCSV = async () => {
    await writer.pipe(fs.createWriteStream(`ReviewTable${counter}.csv`));
    for (var i = 0; i < 250000; i++) {
      //Console Status
      if (i === 0) {console.log(`Seeding @ File # [ ${counter} ] Beginning! ^_^`.rainbow)}
      if (i === 50) { console.log(`[#______]`.rainbow) }
      else if (i === 500) { console.log(`[##_____]`.rainbow) }
      else if (i === 5000) { console.log(`[###____]`.rainbow) }
      else if (i === 50000) { console.log(`[####___]`.rainbow) }
      else if (i === 100000) { console.log(`[#####__]`.rainbow) }
      else if (i === 200000) { console.log(`[######_]`.rainbow) }
      else if (i === 249999) { console.log(`[#######]`.rainbow) }
      
      //Inner Loop to make each individual review
      let random = 2 + (Math.floor(Math.random() * 3));
      for (var j = 0; j < random; j++) {
        let date = new Date(); date = date.toString();
        writer.write({
          restaurant_id: res_id,
          user_id: (1 + Math.floor(Math.random() * 999999)),
          create_date: date,
          description: faker.lorem.paragraph(),
          rating_food: (Math.random() * 5).toFixed(2),
          rating_service: (Math.random() * 5).toFixed(2),
          rating_ambience: (Math.random() * 5).toFixed(2),
          rating_overall: (Math.random() * 5).toFixed(2),
          noise_level: faker.random.arrayElement(['do not recall', 'quiet', 'moderate', 'energetic']),
          would_recommend: randomBool().toString()
        });
      }
      res_id++;
    }
    console.log('CSV Generated, Please Allow 30 Seconds for CSV to onload...'.rainbow);
  }
  await createReviewsCSV();
  setTimeout(async () => {
    console.log('CSV Onloaded, Copying...'.rainbow);
    db.query(`COPY reviews_service.reviews (restuarant_id, user_id, create_date, description, rating_food, rating_service, rating_ambience, rating_overall, noise_level, would_recommend) FROM '/Users/pepe/pepe/HR/SDC/reviews-backend/ReviewTable${counter}.csv' DELIMITERS ',' CSV header;`, async (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Copy Complete'.rainbow);
        console.log(res);
        //Clear file to save memory
        await fs.unlink(`/Users/pepe/pepe/HR/SDC/reviews-backend/ReviewTable${counter}.csv`, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`File Deleted @ ${counter}`.rainbow)
          }
        });
        //Recursive Call
        setTimeout(() => {
          if (counter <=19) {
            console.log(`Seeded File [ ${counter} ] ^_^ Moving Onto next file... `.rainbow)
            counter++;
            main();
          } else {
            console.log('Review Table Seeding Completed! ^_^'.rainbow);
          }
        }, 15000);
      }
    })
  }, 30000);
}

main();

