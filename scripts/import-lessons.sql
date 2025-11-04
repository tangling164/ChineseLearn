-- 课程数据导入 SQL 脚本
-- 生成时间: 2025-11-03T15:28:12.753Z
-- 注意: 此脚本会使用 INSERT ... ON CONFLICT 来处理重复数据

BEGIN;

-- 课程: Basic Greetings (基础问候)
INSERT INTO lessons (lesson_id, title_en, title_zh, description_en, cover, tag, "order")
VALUES (
  'greetings_l1',
  'Basic Greetings',
  '基础问候',
  'After finishing this lesson you will be able to greet people in Mandarin, say goodbye politely, and express thanks in everyday situations.',
  'https://static-main.aiyeshi.cn/typecn-images/greetings.png',
  'Greeting',
  1
)
ON CONFLICT (lesson_id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_zh = EXCLUDED.title_zh,
  description_en = EXCLUDED.description_en,
  cover = EXCLUDED.cover,
  tag = EXCLUDED.tag,
  "order" = EXCLUDED."order",
  updated_at = NOW();

-- 插入课程项目
DO $$
DECLARE
  lesson_db_id INTEGER;
BEGIN
  SELECT id INTO lesson_db_id FROM lessons WHERE lesson_id = 'greetings_l1';

  DELETE FROM lesson_items WHERE lesson_id = lesson_db_id;

  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    '2c3a9f33-5b49-4b82-ab4a-9bc9466d887e',
    lesson_db_id,
    'word',
    'Hello',
    '你好',
    'ni3hao3',
    '["nihao","ni hao","ni3hao3","ni3 hao3"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/nihao.mp3',
    1
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'f8e91d42-3c7a-4b1e-9f82-1a2b3c4d5e6f',
    lesson_db_id,
    'word',
    'Thank you',
    '谢谢',
    'xie4xie4',
    '["xiexie","xie xie","xie4xie4","xie4 xie4"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/xiexie.mp3',
    2
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    '59ea1fa2-6ceb-4c97-890b-8a1e8d205b9f',
    lesson_db_id,
    'word',
    'Good-bye',
    '再见',
    'zai4jian4',
    '["zaijian","zai jian","zai4jian4","zai4 jian4"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/zaijian.mp3',
    3
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    lesson_db_id,
    'word',
    'Good morning',
    '早上好',
    'zao3shang4hao3',
    '["zaoshanghao","zao shang hao","zao3shang4hao3","zao3 shang4 hao3"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/zaoshanghao.mp3',
    4
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'b2c3d4e5-f6g7-8901-bcde-f23456789012',
    lesson_db_id,
    'word',
    'Good evening',
    '晚上好',
    'wan3shang4hao3',
    '["wanshanghao","wan shang hao","wan3shang4hao3","wan3 shang4 hao3"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/wanshanghao.mp3',
    5
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'c3d4e5f6-g7h8-9012-cdef-345678901234',
    lesson_db_id,
    'word',
    'May I ask…',
    '请问',
    'qing3wen4',
    '["qingwen","qing wen","qing3wen4","qing3 wen4"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/qingwen.mp3',
    6
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'd4e5f6g7-h8i9-0123-defg-456789012345',
    lesson_db_id,
    'word',
    'Sorry',
    '对不起',
    'dui4bu4qi3',
    '["duibuqi","dui bu qi","dui4bu4qi3","dui4 bu4 qi3"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/duibuqi.mp3',
    7
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'e5f6g7h8-i9j0-1234-efgh-567890123456',
    lesson_db_id,
    'word',
    'It''s OK',
    '没关系',
    'mei2guan1xi4',
    '["meiguanxi","mei guan xi","mei2guan1xi4","mei2 guan1 xi4"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/meiguanxi.mp3',
    8
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'f6g7h8i9-j0k1-2345-fghi-678901234567',
    lesson_db_id,
    'word',
    'Welcome',
    '欢迎',
    'huan1ying2',
    '["huanying","huan ying","huan1ying2","huan1 ying2"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/huanying.mp3',
    9
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'g7h8i9j0-k1l2-3456-ghij-789012345678',
    lesson_db_id,
    'word',
    'Congratulations',
    '恭喜',
    'gong1xi3',
    '["gongxi","gong xi","gong1xi3","gong1 xi3"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/gongxi.mp3',
    10
  );
END $$;

-- 课程: Casual Conversation (日常对话)
INSERT INTO lessons (lesson_id, title_en, title_zh, description_en, cover, tag, "order")
VALUES (
  'conversation_l1',
  'Casual Conversation',
  '日常对话',
  'Learn common casual conversation phrases that Chinese people use in everyday situations to sound more natural and friendly.',
  'https://static-main.aiyeshi.cn/typecn-images/conversation.png',
  'Conversation',
  2
)
ON CONFLICT (lesson_id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_zh = EXCLUDED.title_zh,
  description_en = EXCLUDED.description_en,
  cover = EXCLUDED.cover,
  tag = EXCLUDED.tag,
  "order" = EXCLUDED."order",
  updated_at = NOW();

-- 插入课程项目
DO $$
DECLARE
  lesson_db_id INTEGER;
BEGIN
  SELECT id INTO lesson_db_id FROM lessons WHERE lesson_id = 'conversation_l1';

  DELETE FROM lesson_items WHERE lesson_id = lesson_db_id;

  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'h8i9j0k1-l2m3-4567-hijk-890123456789',
    lesson_db_id,
    'word',
    'Have you eaten?',
    '吃了吗？',
    'chi1le5ma5',
    '["chilema","chi le ma","chi1le ma","chi1 le ma"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/chilema.mp3',
    1
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'i9j0k1l2-m3n4-5678-ijkl-901234567890',
    lesson_db_id,
    'word',
    'Thanks for waiting',
    '久等了',
    'jiu3deng3le5',
    '["jiudengle","jiu deng le","jiu3deng3le","jiu3 deng3 le"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/jiudengle.mp3',
    2
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'j0k1l2m3-n4o5-6789-jklm-012345678901',
    lesson_db_id,
    'word',
    'Come on!',
    '加油',
    'jia1you2',
    '["jiayou","jia you","jia1you2","jia1 you2"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/jiayou.mp3',
    3
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'k1l2m3n4-o5p6-7890-klmn-123456789012',
    lesson_db_id,
    'word',
    'Let''s go',
    '走吧',
    'zou3ba5',
    '["zouba","zou ba","zou3ba","zou3 ba"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/zouba.mp3',
    4
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'l2m3n4o5-p6q7-8901-lmno-234567890123',
    lesson_db_id,
    'word',
    'Long time no see',
    '好久不见',
    'hao3jiu3bu4jian4',
    '["haojiubujian","hao jiu bu jian","hao3jiu3bu4jian4","hao3 jiu3 bu4 jian4"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/haojiubujian.mp3',
    5
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'm3n4o5p6-q7r8-9012-mnop-345678901234',
    lesson_db_id,
    'word',
    'Wait a moment',
    '等一下',
    'deng3yi2xia4',
    '["dengyixia","deng yi xia","deng3yi2xia4","deng3 yi2 xia4"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/dengyixia.mp3',
    6
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'n4o5p6q7-r8s9-0123-nopq-456789012345',
    lesson_db_id,
    'word',
    'Take care',
    '慢走',
    'man4zou3',
    '["manzou","man zou","man4zou3","man4 zou3"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/manzou.mp3',
    7
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'o5p6q7r8-s9t0-1234-opqr-567890123456',
    lesson_db_id,
    'word',
    'Be careful',
    '小心',
    'xiao3xin1',
    '["xiaoxin","xiao xin","xiao3xin1","xiao3 xin1"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/xiaoxin.mp3',
    8
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'p6q7r8s9-t0u1-2345-pqrs-678901234567',
    lesson_db_id,
    'word',
    'Good luck',
    '祝你好运',
    'zhu4ni3hao3yun4',
    '["zhunihaoyun","zhu ni hao yun","zhu4ni3hao3yun4","zhu4 ni3 hao3 yun4"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/zhunihaoyun.mp3',
    9
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'q7r8s9t0-u1v2-3456-qrst-789012345678',
    lesson_db_id,
    'word',
    'Happy birthday',
    '生日快乐',
    'sheng1ri4kuai4le4',
    '["shengrikuaile","sheng ri kuai le","sheng1ri4kuai4le4","sheng1 ri4 kuai4 le4"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/shengrikuaile.mp3',
    10
  );
END $$;

-- 课程: Ordering Basics (点餐基础)
INSERT INTO lessons (lesson_id, title_en, title_zh, description_en, cover, tag, "order")
VALUES (
  'restaurant_l1',
  'Ordering Basics',
  '点餐基础',
  'Learn essential vocabulary and phrases for ordering food and drinks at Chinese restaurants.',
  'https://static-main.aiyeshi.cn/typecn-images/order.png',
  'Food',
  3
)
ON CONFLICT (lesson_id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_zh = EXCLUDED.title_zh,
  description_en = EXCLUDED.description_en,
  cover = EXCLUDED.cover,
  tag = EXCLUDED.tag,
  "order" = EXCLUDED."order",
  updated_at = NOW();

-- 插入课程项目
DO $$
DECLARE
  lesson_db_id INTEGER;
BEGIN
  SELECT id INTO lesson_db_id FROM lessons WHERE lesson_id = 'restaurant_l1';

  DELETE FROM lesson_items WHERE lesson_id = lesson_db_id;

  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'r8s9t0u1-v2w3-4567-rstu-890123456789',
    lesson_db_id,
    'word',
    'Waiter / Waitress',
    '服务员',
    'fu2wu4yuan2',
    '["fuwuyuan","fu wu yuan","fu2wu4yuan2","fu2 wu4 yuan2"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/fuwuyuan.mp3',
    1
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    's9t0u1v2-w3x4-5678-stuv-901234567890',
    lesson_db_id,
    'word',
    'Menu',
    '菜单',
    'cai4dan1',
    '["caidan","cai dan","cai4dan1","cai4 dan1"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/caidan.mp3',
    2
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    't0u1v2w3-x4y5-6789-tuvw-012345678901',
    lesson_db_id,
    'word',
    'Order food',
    '点菜',
    'dian3cai4',
    '["diancai","dian cai","dian3cai4","dian3 cai4"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/diancai.mp3',
    3
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'u1v2w3x4-y5z6-7890-uvwx-123456789012',
    lesson_db_id,
    'word',
    'Place an order',
    '点单',
    'dian3dan1',
    '["diandan","dian dan","dian3dan1","dian3 dan1"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/diandan.mp3',
    4
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'v2w3x4y5-z6a7-8901-vwxy-234567890123',
    lesson_db_id,
    'word',
    'Rice',
    '米饭',
    'mi3fan4',
    '["mifan","mi fan","mi3fan4","mi3 fan4"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/mifan.mp3',
    5
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'w3x4y5z6-a7b8-9012-wxyz-345678901234',
    lesson_db_id,
    'word',
    'Dumplings',
    '饺子',
    'jiao3zi5',
    '["jiaozi","jiao zi","jiao3zi","jiao3 zi"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/jiaozi.mp3',
    6
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'x4y5z6a7-b8c9-0123-xyza-456789012345',
    lesson_db_id,
    'word',
    'Noodles',
    '面条',
    'mian4tiao2',
    '["miantiao","mian tiao","mian4tiao2","mian4 tiao2"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/miantiao.mp3',
    7
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'y5z6a7b8-c9d0-1234-yzab-567890123456',
    lesson_db_id,
    'word',
    'Bottled water',
    '瓶装水',
    'ping2zhuang1shui3',
    '["pingzhuangshui","ping zhuang shui","ping2zhuang1shui3","ping2 zhuang1 shui3"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/pingzhuangshui.mp3',
    8
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'z6a7b8c9-d0e1-2345-zabc-678901234567',
    lesson_db_id,
    'word',
    'Beer',
    '啤酒',
    'pi2jiu3',
    '["pijiu","pi jiu","pi2jiu3","pi2 jiu3"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/pijiu.mp3',
    9
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'a7b8c9d0-e1f2-3456-abcd-789012345678',
    lesson_db_id,
    'word',
    'Green tea',
    '绿茶',
    'lu4cha2',
    '["lucha","lu cha","lu4cha2","lu4 cha2"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/lvcha.mp3',
    10
  );
END $$;

-- 课程: Dining Requests (用餐要求)
INSERT INTO lessons (lesson_id, title_en, title_zh, description_en, cover, tag, "order")
VALUES (
  'restaurant_l2',
  'Dining Requests',
  '用餐要求',
  'Learn how to make specific requests about food preferences, spice levels, and dining needs.',
  'https://static-main.aiyeshi.cn/typecn-images/dining.png',
  'Food',
  4
)
ON CONFLICT (lesson_id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_zh = EXCLUDED.title_zh,
  description_en = EXCLUDED.description_en,
  cover = EXCLUDED.cover,
  tag = EXCLUDED.tag,
  "order" = EXCLUDED."order",
  updated_at = NOW();

-- 插入课程项目
DO $$
DECLARE
  lesson_db_id INTEGER;
BEGIN
  SELECT id INTO lesson_db_id FROM lessons WHERE lesson_id = 'restaurant_l2';

  DELETE FROM lesson_items WHERE lesson_id = lesson_db_id;

  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'b8c9d0e1-f2g3-4567-bcde-890123456789',
    lesson_db_id,
    'word',
    'Pay the bill',
    '买单',
    'mai3dan1',
    '["maidan","mai dan","mai3dan1","mai3 dan1"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/maidan.mp3',
    1
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'c9d0e1f2-g3h4-5678-cdef-901234567890',
    lesson_db_id,
    'word',
    'Take away',
    '打包',
    'da3bao1',
    '["dabao","da bao","da3bao1","da3 bao1"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/dabao.mp3',
    2
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'd0e1f2g3-h4i5-6789-defg-012345678901',
    lesson_db_id,
    'word',
    'Spicy',
    '辣的',
    'la4de5',
    '["lade","la de","la4de","la4 de"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/lade.mp3',
    3
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'e1f2g3h4-i5j6-7890-efgh-123456789012',
    lesson_db_id,
    'word',
    'No spice',
    '不要辣',
    'bu4yao4la4',
    '["buyaola","bu yao la","bu4yao4la4","bu4 yao4 la4"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/buyaola.mp3',
    4
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'f2g3h4i5-j6k7-8901-fghi-234567890123',
    lesson_db_id,
    'word',
    'Extra spicy',
    '多放辣',
    'duo1fang4la4',
    '["duofangla","duo fang la","duo1fang4la4","duo1 fang4 la4"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/duofangla.mp3',
    5
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'g3h4i5j6-k7l8-9012-ghij-345678901234',
    lesson_db_id,
    'word',
    'Sweet',
    '甜的',
    'tian2de5',
    '["tiande","tian de","tian2de","tian2 de"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/tiande.mp3',
    6
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'h4i5j6k7-l8m9-0123-hijk-456789012345',
    lesson_db_id,
    'word',
    'Light flavor',
    '清淡',
    'qing1dan4',
    '["qingdan","qing dan","qing1dan4","qing1 dan4"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/qingdan.mp3',
    7
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'i5j6k7l8-m9n0-1234-ijkl-567890123456',
    lesson_db_id,
    'word',
    'Vegetarian',
    '素食',
    'su4shi2',
    '["sushi","su shi","su4shi2","su4 shi2"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/sushi.mp3',
    8
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'j6k7l8m9-n0o1-2345-jklm-678901234567',
    lesson_db_id,
    'word',
    'Hot',
    '热的',
    're4de5',
    '["rede","re de","re4de","re4 de"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/rede.mp3',
    9
  );
  INSERT INTO lesson_items (item_id, lesson_id, type, en, zh, py, accepted, audio, "order")
  VALUES (
    'k7l8m9n0-o1p2-3456-klmn-789012345678',
    lesson_db_id,
    'word',
    'Cold / Iced',
    '冰的',
    'bing1de5',
    '["bingde","bing de","bing1de","bing1 de"]'::jsonb,
    'https://static-main.aiyeshi.cn/typecn-audio/bingde.mp3',
    10
  );
END $$;

COMMIT;

-- 验证导入结果
SELECT COUNT(*) as total_lessons FROM lessons;
SELECT COUNT(*) as total_items FROM lesson_items;
