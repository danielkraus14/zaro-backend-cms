const User = require("../models/user");
const FuneralNotice = require("../models/funeralNotice");

const paginateOptions = {
  page: 1,
  limit: 15,
  sort: { date: -1 },
}

const getFuneralNotices = async () => {
  let result;
  try {
    await FuneralNotice.paginate({}, paginateOptions, function(err, res){
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

const getFuneralNoticesByReligion = async (religion) => {
  let result;
  try {
    await FuneralNotice.paginate({ religion: religion }, paginateOptions, function(err, res){
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

const getFuneralNoticesByDate = async (date) => {
  let result;
  try {
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);
    await FuneralNotice.paginate({ date: { $gte: start, $lte: end } }, paginateOptions, function(err, res){
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

const getFuneralNoticesByStatus = async (status) => {
  let result;
  try {
    await FuneralNotice.paginate({ status: status }, paginateOptions, function(err, res){
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

const searchFuneralNotice = async (search) => {
  let result;
  try {
    let query = {};
    if (search.deceased) {
      query.deceased = { $regex: new RegExp(search.deceased), $options: "i" };
    }
    if(search.content){
      query.content = { $regex: new RegExp(search.content), $options: "i" };
    }
    await FuneralNotice.paginate(query, paginateOptions, function(err, res){
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

const createFuneralNotice = async (
  userId,
  title,
  deceased,
  client,
  date,
  religion,
  status,
  content,
) => {
  let result;
  try {
    const funeralNotice = new FuneralNotice({
      userId,
      title,
      deceased,
      client,
      date,
      religion,
      status,
      content,
    });
    const userFound = await User.findById(userId);
    if (!userFound) throw new Error("User not found");

    userFound.funeralNotices.push(funeralNotice._id);
    await userFound.save();
    result = await funeralNotice.save();
  } catch (error) {
    throw error;
  }
  return result;
};

const updateFuneralNotice = async (
  funeralNoticeId,
  userId,
  title,
  deceased,
  client,
  date,
  religion,
  status,
  content,
) => {
  let result;
  try {
    const funeralNotice = await FuneralNotice.findById(funeralNoticeId);
    if (!funeralNotice) throw new Error("Funeral notice not found");

    if (title) funeralNotice.title = title;
    if (deceased) funeralNotice.deceased = deceased;
    if (client) funeralNotice.client = client;
    if (date) funeralNotice.date = date;
    if (religion) funeralNotice.religion = religion;
    if (status) funeralNotice.status = status;
    if (content) funeralNotice.content = content;

    result = await post.save();
  } catch (error) {
    throw error;
  }
  return result;
};

const deleteFuneralNotice = async (funeralNoticeId, userId) => {
  let result;
  try {
    const funeralNotice = await FuneralNotice.findById(funeralNoticeId);
    if (!funeralNotice) throw new Error("Funeral notice not found");
    //Find the user and delete the funeralNotice._id from the user's funeral notices array
    const userFound = await User.findById(userId);
    if (!userFound) throw new Error("User not found");
    userFound.funeralNotices.pull(funeralNotice._id);
    await userFound.save();

    result = await funeralNotice.remove();
  } catch (error) {
    throw error;
  }
  return result;
};

module.exports = {
  getFuneralNotices,
  createFuneralNotice,
  searchFuneralNotice,
  getFuneralNoticesByReligion,
  getFuneralNoticesByDate,
  getFuneralNoticesByStatus,
  updateFuneralNotice,
  deleteFuneralNotice,
};
