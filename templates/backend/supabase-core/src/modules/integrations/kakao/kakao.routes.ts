import { Router } from 'express';
import { searchKakaoAddress } from './kakao.controller';

export const kakaoRouter = Router();

kakaoRouter.get('/address', searchKakaoAddress);
