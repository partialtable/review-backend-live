//Bring in Dependencies
const fs = require('fs');
const csvWriter = require('csv-write-stream');
let writer = csvWriter();
const faker = require('faker');
const colors = require('colors');
//Bash Dependencies
const util = require('util');
const exec = util.promisify(require('child_process').exec);
//Init counter's
let counter = 1;
let restaurant_id = 1;

//Helper Functions

const randomBool = (random = Math.floor(Math.random() * 10)) => random % 2 === 0 ? true : false;

const generateReviews = () => {
  let result = [];
  for (let i = 0; i < (1 + Math.floor(Math.random() * 4)); i++) {
    let date = new Date();
    let obj = {};
    obj.user_id = (1 + Math.floor(Math.random() * 9999));
    obj.create_date = date;
    obj.description = faker.lorem.paragraph();
    obj.rating_food = (Math.random() * 5).toFixed(2);
    obj.rating_service = (Math.random() * 5).toFixed(2);
    obj.rating_ambience = (Math.random() * 5).toFixed(2);
    obj.rating_overall = (Math.random() * 5).toFixed(2);
    obj.noise_level = faker.random.arrayElement(['do not recall', 'quiet', 'moderate', 'energetic']);
    obj.would_recommend = randomBool();
    result.push(obj);
  }
  return result;
}

const generateRandomArr = () => {
  return [randomBool(), randomBool(), randomBool(), randomBool()];
}

const main = async () => {
  console.log(`Total Stack --> ${restaurant_id}`.rainbow);
  const createRestaurantReviewDocument = async () => {
    writer.pipe(fs.createWriteStream(`AvocadoRestaurant${counter}.csv`));
    for (var i = 0; i < 500000; i++) {
      if (i === 0) {console.log(`Seeding @ File # [ ${counter} ] Beginning! ^_^`.rainbow)}
      if (i === 50) { console.log(`[#________]`.rainbow) }
      else if (i === 5000) { console.log(`[##_______]`.rainbow) }
      else if (i === 50000) { console.log(`[###______]`.rainbow) }
      else if (i === 100000) { console.log(`[####_____]`.rainbow) }
      else if (i === 200000) { console.log(`[#####____]`.rainbow) }
      else if (i === 300000) { console.log(`[######___]`.rainbow) }
      else if (i === 400000) { console.log(`[#######__]`.rainbow) }
      else if (i === 450000) { console.log(`[########_]`.rainbow) }
      else if (i === 499999) { console.log(`[#########]`.rainbow) }
      const five = Math.random();
      const four = Math.random() * (1 - five);
      const three = Math.random() * (1 - (five + four));
      const two = Math.random() * (1 - (five + four + three));
      const one = Math.random() * (1 - (five + four + three + two));
      writer.write({
        _key: restaurant_id,
        restaurant_name: faker.company.companyName(),
        number_of_reviews: Math.floor(Math.random() * 400),
        food_overall_rating: (Math.random() * 5).toFixed(2),
        service_overall_rating: (Math.random() * 5).toFixed(2),
        ambiance_overall_rating: (Math.random() * 5).toFixed(2),
        overall_rating: (Math.random() * 5).toFixed(2),
        noise_level: faker.random.arrayElement(['do not recall', 'quiet', 'moderate', 'energetic']),
        one_star_percent: one.toFixed(2),
        two_star_percent: two.toFixed(2),
        three_star_percent: three.toFixed(2),
        four_star_percent: four.toFixed(2),
        five_star_percent: five.toFixed(2),
        loved_for_array: generateRandomArr(),
        filters_array: generateRandomArr(),
        reviews: generateReviews()
      });
      restaurant_id++;
    }
  }
  //Wait for CSV
  await createRestaurantReviewDocument();
  setTimeout(async () => {
    if (counter <= 9) {
    const bash = async () => {
      console.log(`Importing data to ArangoDB @ File # [ ${counter} ]`);
      try {
        const { stdout, stderr } = await exec(`arangoimport --file "/Users/pepe/pepe/HR/SDC/reviews-backend/AvocadoRestaurant${counter}.csv" --type csv --collection "resData" --server.database test --server.password ''`);
        console.log(`stdout --> ${stdout}`.rainbow);
        console.log(`stderr --> ${stderr}`.rainbow);
      } catch (err) {
        console.log(err);
      }
    }
    await bash();
    setTimeout(async () => {
      await fs.unlink(`/Users/pepe/pepe/HR/SDC/reviews-backend/AvocadoRestaurant${counter}.csv`, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`File Deleted --> AvocadoRestaurant${counter}.csv`)
        }
      })
    }, 20000);
    counter++;
    main();
    } else {
      console.log('All Files Imported!'.rainbow);
    }
  }, 30000);
}

main();



// SO basicaly i only needto typew fo 


