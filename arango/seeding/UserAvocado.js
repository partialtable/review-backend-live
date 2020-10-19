//Bring in Dependencies
const fs = require('fs');
const csvWriter = require('csv-write-stream');
let writer = csvWriter();
const faker = require('faker');
const colors = require('colors');
//Bash Dependencies
const util = require('util');
const exec = util.promisify(require('child_process').exec);
//Init counter
let counter = 1;


//Helper functions
const generateRandomPhotoUrl = () => {
  let url = 'https://www.example.com/';
  let random = Math.floor(Math.random() * 1000);
  return url + random.toString();
}

//Create CSV
const main = async () => {
  const createUserDocumentCSV = async () => {
    writer.pipe(fs.createWriteStream('AvocadoUser.csv'));
    for (var i = 0; i < 1000000; i++) {
      
      writer.write({
        _key: i + 1,
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        location: faker.address.city(),
        avatar_url: generateRandomPhotoUrl()
      });
    }
    writer.end();
    console.log('CSV Generated, please allow 30 seconds for CSV To onload'.rainbow);
  }
  await createUserDocumentCSV();
  const bash = async () => {
    console.log('Import process starting...'.rainbow);
    try {
      console.log('Entered Try Block'.rainbow)
      const { stdout, stderr } = await exec(`arangoimport --file "AvocadoUser.csv" --type csv --collection "userData" --server.database test --server.password ''`);
      console.log(`stdout --> ${stdout}`.rainbow);
      console.log(`stderr --> ${stderr}`.rainbow);
    } catch (err){
      console.log(err);
    }
  }
  setTimeout(() => {
    bash();
  }, 30000)
}

main();
