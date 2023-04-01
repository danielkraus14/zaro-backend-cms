const PrintEdition = require("../models/printEdition");
const Tag = require("../models/tag");

const { deleteFile } = require('../s3');


const paginateOptions = {
  page: 1,
  limit: 15,
  sort: { date: -1 },
}

const getPrintEditions = async () => {
  let result;
  try {
    await PrintEdition.paginate({}, paginateOptions, function(err, res){
      if (err) {
        throw err;
      }
      result = res;
    })
  } catch (error) {
    throw error;
  }
  return result;
};

const getPrintEditionsByDate = async (date) => {
  let result;
  try {
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);
    await PrintEdition.paginate({ date: { $gte: start, $lte: end } }, paginateOptions, function(err, res){
      if (err) {
        throw err;
      }
      result = res;
    })
  } catch (error) {
    throw error;
  }
  return result;
};

const createPrintEdition = async (
  date,
  frontPage,
  newsletterPDF,
  body,
  tags
) => {
  let result;
  try {
    const frontPagePath = `https://${process.env.BUCKET_NAME_AWS}.s3.${process.env.BUCKET_REGION_AWS}.amazonaws.com/${frontPage}`
    const newsletterPDFPath = `https://${process.env.BUCKET_NAME_AWS}.s3.${process.env.BUCKET_REGION_AWS}.amazonaws.com/${newsletterPDF}`
    const printEdition = new PrintEdition({
      date,
      frontPage: frontPagePath,
      newsletterPDF: newsletterPDFPath,
      body,
    });
    if (tags) {
      tags.map(async (tag) => {
        const tagFound = await Tag.findOne({ name: tag });
        if (!tagFound) {
          const newTag = new Tag({ name: tag });
          newTag.printEditions.push(printEdition._id);
          await newTag.save();
          printEdition.tags.push(newTag.name);
        } else {
          printEdition.tags.push(tagFound.name);
          tagFound.printEditions.push(printEdition._id);
        }
      });
    };
    result = await printEdition.save();
  } catch (error) {
    throw error;
  };
  return result;
};

const updatePrintEdition = async (
  printEditionId,
  date,
  frontPage,
  newsletterPDF,
  body,
  tags
) => {
  let result;
  try {
    const printEdition = await PrintEdition.findById(printEditionId);
    if (!printEdition) throw new Error("Print edition not found");
    if (date) printEdition.date = date;
    if (body) printEdition.body = body;
    if (frontPage) {
      const frontPagePath = `https://${process.env.BUCKET_NAME_AWS}.s3.${process.env.BUCKET_REGION_AWS}.amazonaws.com/${frontPage}`
      printEdition.frontPage = frontPagePath;
    };
    if (newsletterPDF) {
      const newsletterPDFPath = `https://${process.env.BUCKET_NAME_AWS}.s3.${process.env.BUCKET_REGION_AWS}.amazonaws.com/${newsletterPDF}`
      printEdition.newsletterPDF = newsletterPDFPath;
    };
    if (tags) {
        tags.map(async (tag) => {
            if(printEdition.tags.indexOf(tag) == -1){
                const tagFound = await Tag.findOne({ name: tag });
                if (!tagFound) {
                    const newTag = new Tag({ name: tag });
                    newTag.printEditions.push(printEdition._id);
                    await newTag.save();
                }else {
                    tagFound.printEditions.push(printEdition._id);
                    await tagFound.save();
                }
            }
        });
        printEdition.tags.map(async (tag) => {
            if(tags.indexOf(tag) == -1){
                const tagFound = await Tag.findOne({ name: tag });
                if (tagFound) {
                    tagFound.printEditions.pull(printEdition._id);
                    await tagFound.save();
                }
            }
        });
        printEdition.tags = tags;
    }
    result = await printEdition.save();
  } catch (error) {
    throw error;
  }
  return result;
};

const deletePrintEdition = async (printEditionId) => {
  let result;
  try {
    const printEdition = await PrintEdition.findById(printEditionId);
    if (!printEdition) throw new Error("Print edition not found");
    //Delete frontPage and newsletterPDF from S3 server
    if (printEdition.frontPage) {
      await deleteFile(printEdition.frontPage);
    };
    if (printEdition.newsletterPDF) {
      await deleteFile(printEdition.newsletterPDF);
    };
    result = await printEdition.remove();
  } catch (error) {
    throw error;
  }
  return result;
};

module.exports = {
  getPrintEditions,
  getPrintEditionsByDate,
  createPrintEdition,
  updatePrintEdition,
  deletePrintEdition,
};
