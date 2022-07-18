import Dishes from "../db/models/dishes";
import User from "../db/models/user";
export default class FileService {
  public async addAvatar(userId: String, fileName: String) {
    try {
      // throw new Error("异步error");
      if (userId) {
        let res = await User.updateOne(
          { _id: userId },
          { $set: { userIcon: fileName } }
        );
        return res;
      } else {
        throw new Error("您未登录或用户不存在");
      }
    } catch (error) {
      // console.log("addAvatar函数执行");
      throw error;
    }
  }
}
