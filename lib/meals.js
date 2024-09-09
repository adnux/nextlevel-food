import { S3 } from '@aws-sdk/client-s3';
import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';

// Constants
const S3_REGION = 'eu-central-1';
const S3_BUCKET_NAME = 'andreferreira-nextlevel-food-demo';
const DB_NAME = 'meals.db';
const BUCKET_URL = 'https://andreferreira-nextlevel-food-demo.s3.eu-central-1.amazonaws.com';

// Initializations
const s3 = new S3({ region: S3_REGION });
const db = sql(DB_NAME);

// Helper functions
const getImageUrl = (image) => `${BUCKET_URL}/${image}`;

const sanitizeMeal = (meal) => ({
  ...meal,
  slug: slugify(meal.title, { lower: true }),
  instructions: xss(meal.instructions)
});

const uploadImageToS3 = async (image, fileName) => {
  const bufferedImage = await image.arrayBuffer();
  await s3.putObject({
    Bucket: S3_BUCKET_NAME,
    Key: fileName,
    Body: Buffer.from(bufferedImage),
    ContentType: image.type,
  });
};

// Database operations
const getMeals = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  // throw new Error('Failed to fetch meals');
  return db.prepare('SELECT * FROM meals').all();
};

const getMeal = (slug) => 
  db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);

const insertMeal = (meal) => 
  db.prepare(`
    INSERT INTO meals (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (@title, @summary, @instructions, @creator, @creator_email, @image, @slug)
  `).run(meal);

// Main functions
const saveMeal = async (meal) => {
  const sanitizedMeal = sanitizeMeal(meal);
  const extension = meal.image.name.split('.').pop();
  const fileName = `${sanitizedMeal.slug}.${extension}`;

  await uploadImageToS3(meal.image, fileName);

  sanitizedMeal.image = fileName;
  insertMeal(sanitizedMeal);
};

export { getImageUrl, getMeals, getMeal, saveMeal };
