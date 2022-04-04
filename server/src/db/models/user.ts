import { model } from 'mongoose';

import { UserSchema} from '../schemas/user';

export default model('User', UserSchema,'users');
