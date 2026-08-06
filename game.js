// ========== 种子随机数 ==========
class SeededRandom {
    constructor(seed) { this.seed = seed; }
    next() { this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff; return this.seed / 0x7fffffff; }
    nextInt(min, max) { return Math.floor(this.next() * (max - min + 1)) + min; }
    pick(arr) { return arr[Math.floor(this.next() * arr.length)]; }
}

// ========== 出身（讽刺版） ==========
const ORIGINS = {
    xiangtan: {
        name: '湘潭学徒', icon: '🏭',
        skill: 35, network: 20, money: 10, health: 75, guilt: 5,
        desc: '出生在槟榔作坊里，从小闻着石灰和卤水味长大，以为这就是全世界。'
    },
    changsha: {
        name: '长沙商贩', icon: '🏙️',
        skill: 15, network: 40, money: 25, health: 65, guilt: 15,
        desc: '在省城街头摆摊，见过太多嚼槟榔嚼烂嘴的人，但你只看到了商机。'
    },
    yiyang: {
        name: '益阳农户', icon: '🌾',
        skill: 20, network: 10, money: 8, health: 85, guilt: 3,
        desc: '祖辈种槟榔树，你只知道这东西能换钱，不知道它害了多少人。'
    },
    wailai: {
        name: '外来闯荡', icon: '🚶',
        skill: 5, network: 8, money: 3, health: 80, guilt: 0,
        desc: '一无所有来到湖南，听说槟榔来钱快，一头扎了进去。'
    }
};

function getStage(age) {
    if (age < 20) return { name: '学徒期', color: '#7f8c8d' };
    if (age < 30) return { name: '沉迷期', color: '#e67e22' };
    if (age < 45) return { name: '巅峰期', color: '#c0392b' };
    if (age < 60) return { name: '衰退期', color: '#8e44ad' };
    return { name: '终末期', color: '#2c3e50' };
}

// ========== 像素画 ==========
const PIXEL_ARTS = {
    addiction: {
        pixels: ['.....RRRR.....','....RRRRRR....','...RRRRRRRR...','..RRRRRRRRRR..','.RRR8888RRRR.','.RR888888RRR.','RR88888888RRR','R8888888888RR','R8888888888RR','.R88888888RR.','..RR8888RRR..','...RRRRRR....','....RRRR.....','.....RR......','......R......'],
        colors: { R:'#c0392b', 8:'#e74c3c' }
    },
    money: {
        pixels: ['.....GGGG.....','....GGGGGG....','...GGGGGGGG...','..GG888888GG..','.GG88888888GG.','.G8888888888G.','G888YY88888YG','G88YYYY8888YG','G88YYYY8888YG','.G8YYYY8888G.','.GG8YY8888GG.','..GG888888G..','...GGGGGGG...','....GGGGG....','.....GGG.....'],
        colors: { G:'#27ae60', 8:'#2ecc71', Y:'#f1c40f' }
    },
    health: {
        pixels: ['.....HHHH.....','....HHHHHH....','...HHHHHHHH...','..HH333333HH..','.HH33333333HH.','.H3333333333H.','H333333333333H','H333333333333H','H333333333333H','.H3333333333H.','.HH33333333HH.','..HH333333HH..','...HHHHHHHH...','....HHHHHH....','.....HHHH.....'],
        colors: { H:'#c0392b', 3:'#e74c3c' }
    },
    police: {
        pixels: ['.....BBBB.....','....BBBBBB....','...BBBBBBBB...','..BB444444BB..','.BB44444444BB.','.B4444444444B.','B444444444444B','B4444BB44444BB','B444BBBB44444B','.B44BBBB4444B.','.BB4BBBB444BB.','..BBBBBBBBBB..','...BBBBBBBB...','....BBBBBB....','.....BBBB.....'],
        colors: { B:'#2c3e50', 4:'#3498db' }
    },
    family: {
        pixels: ['.....PPPP.....','....PPPPPP....','...PPPPPPPP...','..PP555555PP..','.PP55555555PP.','.P5555555555P.','P555555555555P','P555PP555555PP','P55PPPP555555P','.P5PPPP55555P.','.PP5PPP5555PP.','..PPPPPPPPPP..','...PPPPPPPP...','....PPPPPP....','.....PPPP.....'],
        colors: { P:'#8e44ad', 5:'#9b59b6' }
    },
    cancer: {
        pixels: ['.....DDDD.....','....DDDDDD....','...DDDDDDDD...','..DD666666DD..','.DD66666666DD.','.D6666666666D.','D666666666666D','D666DD666666DD','D66DDDD666666D','.D6DDDD66666D.','.DD6DDD6666DD.','..DDDDDDDDDD..','...DDDDDDDD...','....DDDDDD....','.....DDDD.....'],
        colors: { D:'#1a1a1a', 6:'#333333' }
    },
    final_ban: {
        pixels: ['.....RRRR.....','....RRRRRR....','...RR8888RR...','..RR888888RR..','.RR88888888RR.','.R8888888888R.','R888888888888R','R888888888888R','R888888888888R','.R8888888888R.','.RR88888888RR.','..RR888888RR..','...RR8888RR...','....RRRRRR....','.....RRRR.....'],
        colors: { R:'#c0392b', 8:'#e74c3c' }
    },
    default: {
        pixels: ['.....BBBB.....','....BBBBBB....','...BBBBBBBB...','..BB555555BB..','.BB55555555BB.','.B5555555555B.','B555555555555B','B555BB555555BB','B55BBBB555555B','.B5BBBB55555B.','.BB5BBB5555BB.','..BBBBBBBBBB..','...BBBBBBBB...','....BBBBBB....','.....BBBB.....'],
        colors: { B:'#8B4513', 5:'#D2691E' }
    }
};

// ========== 事件系统 ==========
// 选项类型: 'normal'(固定效果), 'mystery'(盲盒), 'rps'(猜拳), 'foreshadow'(伏笔)
// 连锁事件: chain 字段,如 chain:'chain_abc', chainStep:1

const EVENTS_POOL = [
    // ===== 早期事件 =====
    {
        id: 'first_taste',
        title: '第一口槟榔',
        desc: '师傅递给你一颗槟榔："尝尝，干这行不嚼槟榔，说出去让人笑话。"',
        stage: 'early',
        choices: [
            { text: '接过槟榔，嚼了起来', effects: { skill: 5, health: -8, guilt: 10 }, result: '一股辛辣直冲脑门，你感到一阵眩晕。从这天起，你上瘾了。', type: 'normal', maxPicks: 1 },
            { text: '婉拒："我不吃这个"', effects: { health: 5, guilt: -5 }, result: '师傅脸色一沉："不吃槟榔还想做槟榔？"但你还是守住了底线。', type: 'normal', maxPicks: 1 },
            { text: '犹豫了一下，说"试试看"', effects: {}, result: '', type: 'mystery', mystery: [
                { effects: { skill: 3, health: -3 }, result: '你嚼了两口就吐了，觉得太呛。师傅摇头："没出息。"', weight: 50 },
                { effects: { skill: 8, health: -12, guilt: 15 }, result: '一口下去你爱上了这种感觉。从此每天不嚼几十颗就浑身难受。', weight: 50 }
            ], maxPicks: 1 }
        ]
    },
    {
        id: 'lime_secret',
        title: '石灰的秘密',
        desc: '你发现师傅在槟榔卤水里加了一种白色粉末，比正常用量多得多。师傅说这叫"劲大"。',
        choices: [
            { text: '默默记下配方', effects: { skill: 10, guilt: 10, health: -3 }, result: '你学会了这个"秘方"，以后你的槟榔比别人更让人上瘾。', type: 'normal', maxPicks: 1 },
            { text: '质问师傅是否安全', effects: { skill: 3, network: -5 }, result: '师傅大怒："你懂什么！不这样哪来的回头客！"你被罚扫了一个月的地。', type: 'normal', maxPicks: 1 },
            { text: '偷偷少放一点试试', effects: {}, result: '', type: 'mystery', mystery: [
                { effects: { skill: 5, guilt: -2 }, result: '少放石灰后味道温和了些，意外吸引了一批不喜欢太冲的顾客。', weight: 40 },
                { effects: { skill: -3, money: -5 }, result: '老顾客抱怨"没劲"，流失了一批熟客。师傅气得摔了你的配方。', weight: 60 }
            ], maxPicks: 1 }
        ]
    },
    // ===== 中期事件 =====
    {
        id: 'customer_cancer',
        title: '老顾客的下巴',
        desc: '一个嚼了你家槟榔二十年的老顾客来找你。他张不开嘴了——口腔黏膜纤维化，医生说再嚼下去就是口腔癌。他求你："能不能做一款不那么伤人的？"',
        choices: [
            { text: '良心发现，尝试减害配方', effects: { skill: 5, money: -10, guilt: -15 }, result: '你花了大半年改良配方，虽然利润薄了，但你终于能睡着觉了。这个选择会在将来影响你的命运。', type: 'foreshadow', foreshadowId: 'did_good', maxPicks: 1 },
            { text: '敷衍过去："多喝热水就好了"', effects: { money: 5, guilt: 15 }, result: '老顾客失望地走了。三个月后你听说他确诊了口腔癌。你安慰自己：又不是我逼他嚼的。', type: 'normal', maxPicks: 2 },
            { text: '推荐他嚼更猛的"加强版"', effects: { money: 10, guilt: 25, health: -5 }, result: '你又卖出一批高价货。深夜你对着镜子，发现自己也在嚼槟榔，嘴角已经溃烂。', type: 'normal', maxPicks: 1 }
        ]
    },
    {
        id: 'gov_warning',
        title: '一纸通知',
        desc: '工商局贴出通知：槟榔制品不得宣传"提神醒脑"等功效，不得向未成年人销售。同行们都在骂，说政府多管闲事。',
        choices: [
            { text: '遵守规定，撤下所有虚假宣传', effects: { money: -8, guilt: -10 }, result: '你是街上唯一照做的。虽然短期收入降了，但后来检查时你成了正面典型。', type: 'normal', maxPicks: 2 },
            { text: '换种说法，打擦边球', effects: { money: 5, skill: 3, guilt: 5 }, result: '你把"提神"改成"给力"，工商拿你没办法。你为自己的小聪明得意了好一阵。', type: 'normal', maxPicks: 2 },
            { text: '无视通知，照卖不误', effects: {}, result: '', type: 'mystery', mystery: [
                { effects: { money: 10, guilt: 10 }, result: '一段时间没人管，你以为风头过去了。', weight: 60 },
                { effects: { money: -15, guilt: 10, network: -5 }, result: '被突击检查，罚了一大笔钱，还上了黑名单。', weight: 40 }
            ], maxPicks: 2 }
        ]
    },
    {
        id: 'young_customer',
        title: '穿校服的顾客',
        desc: '一个穿着中学校服的少年站在你摊位前，掏出皱巴巴的零钱要买槟榔。你注意到他的嘴唇已经被槟榔染成了暗红色。',
        choices: [
            { text: '拒绝卖给他，让他好好读书', effects: { money: -3, guilt: -15 }, result: '少年骂骂咧咧走了。旁边摊贩笑你傻，但你觉得对得起良心。', type: 'normal', maxPicks: 2 },
            { text: '卖给他，顺便推荐"学生套餐"', effects: { money: 8, guilt: 20 }, result: '少年成了你的常客。两年后他因口腔问题辍学，你假装不认识他。', type: 'normal', maxPicks: 1 },
            { text: '卖给他，但不给折扣', effects: {}, result: '', type: 'rps', rps: { win: { effects: { money: 8, guilt: 8 }, result: '他买了就走。你没多想。' }, lose: { effects: { money: 5, guilt: 10 }, result: '他赊账跑了。你骂了一句"小兔崽子"。' }, tie: { effects: { money: 3, guilt: 5 }, result: '他买了最便宜的那种。' } }, maxPicks: 2 }
        ]
    },
    {
        id: 'wife_ultimatum',
        title: '妻子的最后通牒',
        desc: '你妻子把你堵在门口："你自己照照镜子！牙齿黑了，嘴巴烂了，天天嚼那破玩意。要么戒槟榔，要么我带孩子走。"',
        choices: [
            { text: '下决心戒槟榔', effects: { health: 15, guilt: -10 }, result: '你痛苦地戒了三个月，但槟榔摊还在开——你只是自己不嚼了，继续卖给别人。这个选择会在将来影响你的命运。', type: 'foreshadow', foreshadowId: 'quit_self', maxPicks: 1 },
            { text: '"我卖这个赚钱养家，你懂什么！"', effects: { health: -8, network: -10, guilt: 10 }, result: '妻子摔门而去。你一个人坐在空荡荡的屋里嚼着槟榔，觉得格外带劲。', type: 'normal', maxPicks: 2 },
            { text: '敷衍说"减量"，偷偷照嚼', effects: {}, result: '', type: 'mystery', mystery: [
                { effects: { health: -5, guilt: 5 }, result: '妻子没发现。但你自己也知道，你根本戒不掉。', weight: 50 },
                { effects: { health: -10, network: -15, guilt: 15 }, result: '被发现了。妻子带着孩子回了娘家，你成了街坊嘴里的"槟榔鬼"。', weight: 50 }
            ], maxPicks: 2 }
        ]
    },
    // ===== 连锁事件：口腔病变 =====
    {
        id: 'mouth_pain_1',
        title: '张嘴困难（连锁1/3）',
        desc: '最近你发现自己张嘴越来越费劲，吃热的东西时口腔火辣辣地疼。你对着镜子看了看，口腔黏膜白花花一片。',
        chain: 'mouth_chain', chainStep: 1, chainLen: 3,
        choices: [
            { text: '去医院检查', effects: { money: -8, health: 10 }, result: '医生严肃地告诉你：口腔黏膜下纤维性变，槟榔引起的癌前病变。必须立刻停止嚼槟榔。', type: 'normal', maxPicks: 1 },
            { text: '自己买点消炎药对付', effects: { health: -5, money: -2, guilt: 5 }, result: '药吃了，症状缓解了几天。但你继续嚼槟榔，很快又复发了。', type: 'normal', maxPicks: 1 },
            { text: '"干这行的谁嘴巴没点毛病"', effects: { health: -12, guilt: 10 }, result: '你没当回事。但你不知道，口腔黏膜的病变正在加速。连锁事件即将继续……', type: 'normal', maxPicks: 1 }
        ]
    },
    {
        id: 'mouth_pain_2',
        title: '口腔溃烂（连锁2/3）',
        desc: '口腔的疼痛越来越严重。你嘴里出现了无法愈合的溃疡，吃什么都疼。你瘦了一大圈。',
        chain: 'mouth_chain', chainStep: 2, chainLen: 3,
        choices: [
            { text: '终于去看医生', effects: { money: -15, health: 5, guilt: -10 }, result: '医生做了活检。你忐忑地等待结果。', type: 'normal', maxPicks: 1 },
            { text: '加大槟榔量来麻痹疼痛', effects: { health: -20, guilt: 20 }, result: '嚼槟榔确实能暂时麻痹疼痛。但每次药效过后，疼得更厉害。你陷入了恶性循环。', type: 'normal', maxPicks: 1 },
            { text: '试试偏方：用白酒漱口', effects: {}, result: '', type: 'mystery', mystery: [
                { effects: { health: -8, guilt: 5 }, result: '白酒刺激得你眼泪直流，溃疡更严重了。', weight: 60 },
                { effects: { health: -3, guilt: 3 }, result: '心理作用让你觉得好了一些。但溃疡依旧。', weight: 40 }
            ], maxPicks: 1 }
        ]
    },
    {
        id: 'mouth_pain_3',
        title: '确诊（连锁3/3）',
        desc: '活检结果出来了：早期口腔鳞状细胞癌。医生说必须手术切除部分组织，术后可能影响说话和进食。你瘫坐在医院走廊里。',
        chain: 'mouth_chain', chainStep: 3, chainLen: 3,
        choices: [
            { text: '接受手术，从此戒槟榔', effects: { health: -25, money: -30, skill: -10, guilt: -30 }, result: '手术成功了，但你失去了半边舌头。你再也做不了槟榔，也再也说不出流利的话。你把剩下的槟榔全烧了。', type: 'normal', maxPicks: 1 },
            { text: '"反正都要死了，不如痛快嚼"', effects: { health: -40, guilt: 30 }, result: '你放弃了治疗。最后的日子，你嘴里塞满了槟榔，嘴角流着血水。家人把你送进了临终关怀病房。', type: 'normal', maxPicks: 1 },
            { text: '四处求医，花光积蓄', effects: { money: -40, health: -20, guilt: -10, network: 5 }, result: '你跑遍了各大医院。钱花光了，病也没治好。最后你回到老家，在痛苦中度过余生。', type: 'normal', maxPicks: 1 }
        ]
    },
    // ===== 金盆洗手事件（唯一好结局出口）=====
    {
        id: 'quit_offer_1',
        title: '💡 金盆洗手的机会',
        desc: '一个多年未见的老同学找到你。他现在在广东开了一家农产品加工厂，做的是正经生意——荔枝干、龙眼干。他说："你手艺这么好，干嘛非做槟榔？来跟我干吧，赚得少点，但晚上睡得着。"',
        stage: 'mid',
        choices: [
            { text: '接受邀请，金盆洗手', effects: {}, result: '', type: 'quit', quitTitle: '🙏 金盆洗手', quitDesc: '你烧掉了所有槟榔配方，坐上了南下的火车。在广东的工厂里，你从零开始学做果干加工。虽然收入只有以前的一半，但你终于不用在梦里被那些溃烂的嘴巴追着跑了。十年后，你成了工厂的技术主管，娶了当地姑娘，有了孩子。有人问起你的过去，你沉默片刻，说："我以前差点成了杀人犯。"' },
            { text: '"槟榔来钱快，我放不下"', effects: { money: 5, guilt: 10 }, result: '老同学叹了口气走了。你继续守着槟榔摊。但每次想起他说的话，心里总有个声音：你本来可以走的。', type: 'normal', maxPicks: 1 },
            { text: '"等我赚够了就走"', effects: { money: 8, guilt: 5 }, result: '你说服了自己再干两年。但你不知道，两年后还有没有机会。', type: 'normal', maxPicks: 1 }
        ]
    },
    {
        id: 'quit_offer_2',
        title: '💡 第二次机会',
        desc: '你的堂兄从老家来找你，说村里在搞乡村振兴，政府扶持特色农业，种水果有补贴、有销路。他想拉你回去合伙种脐橙。"你在外面做那个害人的东西，村里人都知道了。回来吧，种橙子一样能赚钱。"',
        stage: 'late',
        choices: [
            { text: '回去种橙子，重新做人', effects: {}, result: '', type: 'quit', quitTitle: '🌳 回归田园', quitDesc: '你回到了阔别多年的老家。山上的槟榔树被你亲手砍掉，种上了脐橙苗。头两年很苦，但你咬着牙挺过来了。第三年，满山的橙子挂果，金灿灿的一片。你在村里开了农家乐，城里人来采摘都说甜。有人认出你以前是做槟榔的，你笑笑："那都是上辈子的事了。"' },
            { text: '"我没脸回去"', effects: { money: 3, guilt: 8, health: -3 }, result: '你低下了头。堂兄默默离开。你继续守着槟榔摊，但你知道——你离老家越来越远了。', type: 'normal', maxPicks: 1 },
            { text: '"种橙子哪有槟榔来钱快"', effects: { money: 5, guilt: 15, health: -3 }, result: '你嗤之以鼻。堂兄摇头："你早晚会后悔的。"', type: 'normal', maxPicks: 1 }
        ]
    },
    // ===== 后期事件 =====
    {
        id: 'police_raid',
        title: '突击行动',
        desc: '清晨六点，一群穿制服的人冲进你的作坊。你被按在地上，手被反铐。他们说你非法使用工业石灰、违规添加麻黄草提取物。',
        choices: [
            { text: '认罪伏法', effects: { money: -25, network: -15, guilt: -15 }, result: '你在拘留所待了十五天。出来时，作坊已被查封。你想起了那个患口腔癌的老顾客——也许这就是报应。', type: 'normal', maxPicks: 1 },
            { text: '托人找关系', effects: { money: -20, network: -15 }, result: '', type: 'rps', rps: {
                win: { effects: { money: -15, network: -5, guilt: 10 }, result: '花了不少钱，但总算把你捞出来了。你继续干着老本行，只是更隐蔽了。' },
                lose: { effects: { money: -30, guilt: 15, network: -20 }, result: '关系没走通，反而被举报。罪加一等，判了三个月。' },
                tie: { effects: { money: -20, network: -10 }, result: '折腾了一圈，罚款交了不少，但没进去。' }
            }, maxPicks: 1 },
            { text: '趁乱逃跑', effects: {}, result: '', type: 'mystery', mystery: [
                { effects: { money: -10, guilt: 10, health: -5 }, result: '你翻窗跑了。从此成了通缉犯，东躲西藏。槟榔生意彻底完了。', weight: 40 },
                { effects: { money: -5, guilt: 8, health: -10 }, result: '跑掉了但摔断了腿。你躺在出租屋里，连去医院都不敢。', weight: 60 }
            ], maxPicks: 1 }
        ]
    },
    {
        id: 'friend_dies',
        title: '同行之死',
        desc: '你的老伙计——隔壁摊的老王，因为口腔癌走了。才四十二岁。葬礼上，他老婆哭着说："就是那破槟榔害的！"在场的都是槟榔同行，没一个人敢搭话。',
        choices: [
            { text: '幡然醒悟，金盆洗手', effects: {}, result: '', type: 'quit', quitTitle: '🙏 幡然醒悟', quitDesc: '你把存货全倒进了河里。老王葬礼上那些不敢搭话的同行的脸，一张张在你脑海里闪过。你关了作坊，回了老家。虽然不知道以后靠什么吃饭，但你终于不用再昧着良心了。后来你在镇上开了间小卖部，卖烟酒糖茶，唯独不卖槟榔。', maxPicks: 1 },
            { text: '兔死狐悲，但生意照做', effects: { money: 5, guilt: 10, health: -3 }, result: '葬礼回来你多嚼了两颗槟榔压惊。老王的摊位很快被人盘下来，生意照旧。', type: 'normal', maxPicks: 2 },
            { text: '"他嚼太多了，我控制量就没事"', effects: { guilt: 15, health: -5 }, result: '你用这种自欺欺人的话安慰自己。但你每天嚼的量比老王还多。', type: 'normal', maxPicks: 1 }
        ]
    },
    {
        id: 'media_expose',
        title: '暗访曝光',
        desc: '一个自称"想批发"的年轻人跟你聊了半天，套出了你的配方和利润。三天后，一篇名为《一颗槟榔的罪恶：从种植到致癌的暴利链条》的文章刷爆了朋友圈。你的照片赫然在列。',
        choices: [
            { text: '接受采访，公开道歉', effects: { guilt: -15, network: 10 }, result: '你在镜头前承认了自己的过错，呼吁大家远离槟榔。有人说你作秀，但也有人说你至少说了真话。', type: 'normal', maxPicks: 1 },
            { text: '雇水军洗白', effects: { money: -15, guilt: 10 }, result: '', type: 'rps', rps: {
                win: { effects: { money: -10, guilt: 15 }, result: '舆论被压下去了。但你知道，这只是暂时的。' },
                lose: { effects: { money: -20, guilt: 20 }, result: '水军被曝光了是你雇的。舆论彻底炸了，你的店被愤怒的网友围堵。' },
                tie: { effects: { money: -15, guilt: 10 }, result: '花了钱但效果一般。大家该骂还是骂。' }
            }, maxPicks: 1 },
            { text: '关门躲风头', effects: { money: -10, guilt: 5 }, result: '你关了店躲了半个月。风头过了重新开业，但生意大不如前。', type: 'normal', maxPicks: 2 }
        ]
    },
    {
        id: 'last_chance',
        title: '最后的救赎',
        desc: '你的身体已经发出严重警告：口腔溃烂、牙龈萎缩、吞咽困难。医生下了最后通牒：再不戒槟榔，最多两年。你坐在空荡荡的店里，看着满墙的槟榔包装袋，忽然觉得它们像一张张催命符。',
        choices: [
            { text: '烧掉所有存货，彻底转行', effects: {}, result: '', type: 'quit', quitTitle: '🔥 浴火重生', quitDesc: '一把火烧掉了半生心血。火光映着你的脸，你泪流满面，但心里却前所未有的轻松。你回老家种地去了——种的是有机蔬菜，不是槟榔。有人问起你以前做什么的，你说："我以前干过一件很蠢的事，现在不干了。"', maxPicks: 1 },
            { text: '"反正也活不长了，就这样吧"', effects: { health: -30, guilt: 25 }, result: '你放弃了挣扎。每天机械地做槟榔、卖槟榔、嚼槟榔。你不知道自己是在等死，还是在等什么。', type: 'normal', maxPicks: 1 },
            { text: '把店传给徒弟，自己躲起来', effects: { skill: -10, money: 15, guilt: 10, health: -5 }, result: '你拿了笔转让费躲到了乡下。徒弟继续经营着你创下的"品牌"，继续害着下一批人。', type: 'normal', maxPicks: 1 }
        ]
    }
];

// ========== 终局事件 ==========
const FINAL_EVENT = {
    id: 'final_ban',
    title: '终局·全面取缔',
    desc: '一纸红头文件，国家卫健委和市场监管总局联合发布公告：槟榔正式被列为一级致癌物，即日起全国禁止生产、销售、广告。整个行业一夜清零。你毕生从事的事业，被定性为"危害公众健康的非法产业"。你站在被封条贴满的店门口，警察正在清点你的存货准备销毁。',
    choices: [
        { text: '默默接受，转身离开', effects: { money: -50, guilt: -5 }, result: '你最后看了一眼招牌，头也不回地走了。你用了大半辈子才明白：有些钱，不该赚。' },
        { text: '冲进去抢几包存货', effects: {}, result: '', type: 'mystery', mystery: [
            { effects: { money: -30, health: -20, guilt: 20 }, result: '你抢到了几包，躲在角落里拼命嚼。警察发现你时，你满嘴是血，像个疯子。你被强制送进了戒断中心。' },
            { effects: { money: -40, guilt: 15 }, result: '你被当场制服。妨害公务，又加了一条罪名。' }
        ] },
        { text: '跪在店门口，放声大哭', effects: { money: -50, guilt: -15, health: 5 }, result: '围观的群众有人拍照，有人摇头。一个曾经在你店里买过槟榔的年轻人走过来扶起你："老板，你害过我，但你现在也挺可怜的。别哭了，重新开始吧。"' }
    ]
};

// ========== 游戏主类 ==========
class Game {
    constructor() {
        this.state = {
            age: 16, year: 1, skill: 0, network: 0, money: 0, health: 0, guilt: 0,
            origin: null, seed: null, rng: null, mode: 'normal',
            stage: '学徒期', history: [], ended: false,
            endingTitle: '', endingDesc: '',
            eventCount: 0, maxEvents: 8, totalChoices: 0, maxTotalChoices: 22,
            finalTriggered: false,
            foreshadow: {},       // 伏笔标记 { did_good: true, quit_self: true, ... }
            chainState: {},       // 连锁状态 { mouth_chain: { step: 2, next: 'mouth_pain_2' } }
            pendingChain: null    // 待触发的连锁事件id
        };
        this.eventCooldown = {};
        this.choiceUsage = {};
        this.eventHistory = [];
        this.init();
    }

    init() {
        document.querySelectorAll('.origin-card').forEach(card => card.addEventListener('click', () => {
            document.querySelectorAll('.origin-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        }));
        document.querySelectorAll('.mode-btn').forEach(btn => btn.addEventListener('click', () => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        }));
        document.getElementById('btn-start').addEventListener('click', () => this.startGame());
        document.getElementById('btn-history').addEventListener('click', () => { this.loadHistory(); document.getElementById('modal-history').classList.add('active'); });
        document.getElementById('link-rules').addEventListener('click', e => { e.preventDefault(); document.getElementById('modal-rules').classList.add('active'); });
        document.getElementById('link-about').addEventListener('click', e => { e.preventDefault(); document.getElementById('modal-about').classList.add('active'); });
        document.getElementById('btn-skip').addEventListener('click', () => this.skipYears());
        document.getElementById('btn-retire').addEventListener('click', () => this.retire());
        document.getElementById('btn-restart').addEventListener('click', () => this.restart());
        document.getElementById('btn-share').addEventListener('click', () => this.shareCard());
        document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', () => btn.closest('.modal').classList.remove('active')));
        document.querySelectorAll('.modal').forEach(m => m.addEventListener('click', e => { if (e.target === m) m.classList.remove('active'); }));
        this.loadHistory();
    }

    startGame() {
        const originKey = document.querySelector('.origin-card.selected').dataset.origin;
        const modeBtn = document.querySelector('.mode-btn.selected');
        const mode = modeBtn ? modeBtn.dataset.mode : 'normal';
        let seedInput = document.getElementById('seed-input').value.trim();
        const origin = ORIGINS[originKey];
        let seed = seedInput ? parseInt(seedInput) : Math.floor(Math.random() * 999999);
        if (isNaN(seed)) seed = Math.floor(Math.random() * 999999);

        const maxEvts = { normal: 10, hardcore: 8, fast: 6 };
        const maxTotal = { normal: 24, hardcore: 20, fast: 18 };

        this.state = {
            age: 16, year: 1,
            skill: origin.skill, network: origin.network, money: origin.money, health: origin.health, guilt: origin.guilt,
            origin: originKey, seed: seed, rng: new SeededRandom(seed), mode: mode, stage: '学徒期',
            history: [], ended: false, endingTitle: '', endingDesc: '',
            eventCount: 0, maxEvents: maxEvts[mode] || 8,
            totalChoices: 0, maxTotalChoices: maxTotal[mode] || 22,
            finalTriggered: false,
            foreshadow: {}, chainState: {}, pendingChain: null
        };
        this.eventCooldown = {};
        this.choiceUsage = {};
        this.eventHistory = [];

        document.getElementById('home-screen').classList.remove('active');
        document.getElementById('ending-screen').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');
        document.getElementById('game-seed').textContent = seed;
        this.updateUI();
        this.addLog('system', `📜 ${origin.desc}`);
        this.addLog('system', `🎲 种子：${seed} | ${this.getModeName(mode)} | 抉择上限：${this.state.maxTotalChoices}次`);
        this.addLog('event', `你以「${origin.name}」的身份踏入了槟榔江湖。那年你${this.state.age}岁，还不知道这条路通向何方。`);
        setTimeout(() => this.triggerEvent(), 600);
    }

    getModeName(m) { return { normal:'普通', hardcore:'硬核', fast:'快进' }[m] || m; }

    skipYears() {
        if (this.state.ended) return;
        this.advanceYears(this.state.mode === 'fast' ? 5 : 2);
        this.triggerEvent();
    }

    advanceYears(n) {
        for (let i = 0; i < n; i++) {
            this.state.year++; this.state.age++;
            if (this.state.age > 35) this.state.health = Math.max(0, this.state.health - this.state.rng.nextInt(0, 3));
            if (this.state.age > 40) this.state.skill = Math.max(0, this.state.skill - this.state.rng.nextInt(0, 2));
            if (this.state.guilt > 50) this.state.guilt = Math.max(0, this.state.guilt - this.state.rng.nextInt(0, 1));
            this.state.money = Math.max(0, this.state.money - this.state.rng.nextInt(0, 1));
            if (this.state.health < 15 && this.state.rng.next() < 0.25) {
                this.state.health -= 10;
                this.addLog('negative', '⚠️ 你的身体状况急剧恶化……');
            }
        }
        this.state.stage = getStage(this.state.age).name;
        if (this.state.health <= 0) { this.addLog('negative', '💀 你的身体被槟榔彻底摧毁了。'); this.endGame(); return; }
        if (this.state.age >= 70) { this.addLog('system', '👴 垂垂老矣，槟榔江湖再也与你无关。'); this.endGame(); return; }
        this.updateUI();
    }

    triggerEvent() {
        if (this.state.ended) return;
        if (!this.state.finalTriggered && this.state.eventCount >= this.state.maxEvents) { this.triggerFinalEvent(); return; }
        if (this.state.mode === 'hardcore' && this.state.rng.next() < 0.12) {
            this.state.eventCount++;
            this.addLog('system', `⏳ 日子一天天过去，你的牙齿越来越黑，嘴角越来越烂。（剩余${this.state.maxEvents - this.state.eventCount}次事件）`);
            this.advanceYears(this.state.mode === 'fast' ? 5 : 2);
            if (!this.state.finalTriggered && this.state.eventCount >= this.state.maxEvents) { setTimeout(() => this.triggerFinalEvent(), 300); }
            return;
        }

        // 金盆洗手事件：每隔固定次数触发
        const quitOffers = EVENTS_POOL.filter(e => e.id.startsWith('quit_offer_'));
        const usedQuits = quitOffers.filter(e => this.eventCooldown[e.id]);
        // 在事件计数达到一半和四分之三时触发金盆洗手事件
        const halfPoint = Math.floor(this.state.maxEvents / 2);
        const threeQuarterPoint = Math.floor(this.state.maxEvents * 3 / 4);
        if ((this.state.eventCount === halfPoint || this.state.eventCount === threeQuarterPoint) && usedQuits.length < quitOffers.length) {
            const nextQuit = quitOffers.find(e => !this.eventCooldown[e.id]);
            if (nextQuit) {
                this.eventCooldown[nextQuit.id] = true;
                this.state.eventCount++;
                this.renderEvent(nextQuit);
                return;
            }
        }

        // 优先处理待触发的连锁事件
        if (this.state.pendingChain) {
            const chainEvent = EVENTS_POOL.find(e => e.id === this.state.pendingChain);
            if (chainEvent) {
                this.state.pendingChain = null;
                this.state.eventCount++;
                this.renderEvent(chainEvent);
                return;
            }
        }

        let event;
        // 如果有活跃连锁且未完成，随机触发下一步
        const activeChains = Object.entries(this.state.chainState).filter(([,v]) => v.step > 0 && v.step < v.len);
        if (activeChains.length > 0 && this.state.rng.next() < 0.6) {
            const [chainId, chainData] = this.state.rng.pick(activeChains);
            const nextId = `${chainId}_${chainData.step + 1}`;
            const nextEvt = EVENTS_POOL.find(e => e.id === nextId);
            if (nextEvt) { event = nextEvt; }
        }
        if (!event) {
            const available = EVENTS_POOL.filter(e => !this.eventCooldown[e.id] && !e.chain && !e.id.startsWith('quit_offer_'));
            if (available.length === 0) { Object.keys(this.eventCooldown).forEach(k => delete this.eventCooldown[k]); event = this.state.rng.pick(EVENTS_POOL.filter(e => !e.chain && !e.id.startsWith('quit_offer_'))); }
            else event = this.state.rng.pick(available);
        }

        this.eventCooldown[event.id] = true;
        if (Object.keys(this.eventCooldown).length > 14) { const keys = Object.keys(this.eventCooldown); delete this.eventCooldown[keys[0]]; }
        this.state.eventCount++;
        this.renderEvent(event);
    }

    triggerFinalEvent() {
        this.state.finalTriggered = true;
        this.addLog('system', `⚠️ 你已做了${this.state.eventCount}次选择。时代的铡刀终于落下——`);
        this.addLog('negative', '📜 红头文件：槟榔产业全面取缔。一个害人的时代，终于结束了。');
        this.renderEvent(FINAL_EVENT);
    }

    renderPixelArt(eventId) {
        const canvas = document.getElementById('pixel-canvas');
        const ctx = canvas.getContext('2d'); const W = 160, H = 120, cW = 8, cH = 8;
        ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f0f23'; ctx.fillRect(0, 0, W, H);
        const art = PIXEL_ARTS[eventId] || PIXEL_ARTS['default'];
        const rows = art.pixels.length, cols = art.pixels[0].length;
        const ox = Math.floor((W - cols * cW) / 2), oy = Math.floor((H - rows * cH) / 2);
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
            const ch = art.pixels[r][c]; if (ch === '.') continue;
            ctx.fillStyle = art.colors[ch] || '#888';
            ctx.fillRect(ox + c * cW, oy + r * cH, cW, cH);
        }
    }

    renderEvent(event) {
        const ca = document.getElementById('choices-area');
        const el = document.getElementById('event-log');
        this.renderPixelArt(event.id);
        if (!this.state.finalTriggered) {
            this.addLog('event', `<strong>${event.title}</strong> <span style="color:#95a5a6;font-size:0.8em;">[${this.state.maxEvents - this.state.eventCount}次后终局]</span><br>${event.desc}`);
        } else {
            this.addLog('event', `<strong>${event.title}</strong><br>${event.desc}`);
        }
        ca.innerHTML = '';
        event.choices.forEach((choice, idx) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn' + (choice.type === 'quit' ? ' quit-option' : '');
            let disabled = false, reqText = '';
            if (choice.require) for (const [k, v] of Object.entries(choice.require)) if ((this.state[k] || 0) < v) { disabled = true; reqText = ` (需${this.getStatName(k)}≥${v})`; break; }
            const usageKey = `${event.id}_${idx}`; const used = this.choiceUsage[usageKey] || 0;
            const maxP = choice.maxPicks !== undefined ? choice.maxPicks : 99;
            let limitText = '';
            if (maxP < 99) { limitText = ` [${used}/${maxP}]`; if (used >= maxP) { disabled = true; reqText = ' (已用尽)'; } }
            const typeIcon = choice.type === 'mystery' ? '🎁 ' : choice.type === 'rps' ? '✊ ' : choice.type === 'foreshadow' ? '🔮 ' : choice.type === 'quit' ? '🚪 ' : '';
            const typeLabel = choice.type === 'mystery' ? '盲盒' : choice.type === 'rps' ? '猜拳' : choice.type === 'foreshadow' ? '伏笔' : choice.type === 'quit' ? '金盆洗手' : '';
            const effectsText = choice.type ? `[${typeLabel}]` : this.formatEffects(choice.effects || {});
            btn.innerHTML = `${idx + 1}. ${typeIcon}${choice.text}${reqText}${limitText}<span class="choice-effect">${effectsText}</span>`;
            if (disabled) { btn.style.opacity = '0.4'; btn.style.cursor = 'not-allowed'; }
            else btn.addEventListener('click', () => this.applyChoice(choice, event, idx));
            ca.appendChild(btn);
        });
        el.scrollTop = el.scrollHeight;
    }

    applyChoice(choice, event, choiceIdx) {
        const usageKey = `${event.id}_${choiceIdx}`;
        this.choiceUsage[usageKey] = (this.choiceUsage[usageKey] || 0) + 1;
        this.state.totalChoices++;

        // 金盆洗手——唯一好结局
        if (choice.type === 'quit') {
            this.addLog('choice', `👉 你终于做出了正确的选择。`);
            document.getElementById('choices-area').innerHTML = '';
            this.state.ended = true;
            this.state.endingTitle = choice.quitTitle;
            this.state.endingDesc = choice.quitDesc;
            this.state.quitEnding = true;
            this.saveToHistory();
            setTimeout(() => {
                this.renderSummaryCard();
                document.getElementById('game-screen').classList.remove('active');
                document.getElementById('ending-screen').classList.add('active');
                document.getElementById('ending-title').textContent = choice.quitTitle;
            }, 500);
            return;
        }

        // 处理不同选项类型
        let effects = {};
        let resultText = '';

        if (choice.type === 'mystery') {
            const roll = this.state.rng.nextInt(1, 100);
            let acc = 0;
            for (const m of choice.mystery) {
                acc += m.weight;
                if (roll <= acc) { effects = m.effects; resultText = m.result; break; }
            }
        } else if (choice.type === 'rps') {
            const player = choiceIdx % 3;
            const sys = this.state.rng.nextInt(0, 2);
            this.addLog('system', `✊ 你出了${['石头','剪刀','布'][player]}，命运出了${['石头','剪刀','布'][sys]}。`);
            if (player === sys) { effects = choice.rps.tie.effects; resultText = choice.rps.tie.result; }
            else if ((player === 0 && sys === 1) || (player === 1 && sys === 2) || (player === 2 && sys === 0)) { effects = choice.rps.win.effects; resultText = choice.rps.win.result; }
            else { effects = choice.rps.lose.effects; resultText = choice.rps.lose.result; }
        } else if (choice.type === 'foreshadow') {
            effects = choice.effects || {};
            resultText = choice.result || '';
            if (choice.foreshadowId) this.state.foreshadow[choice.foreshadowId] = true;
        } else {
            effects = choice.effects || {};
            resultText = choice.result || '';
        }

        // 应用效果
        for (const [k, v] of Object.entries(effects)) {
            if (this.state[k] !== undefined) this.state[k] = Math.max(0, Math.min(100, this.state[k] + v));
        }

        if (resultText) this.addLog('choice', `👉 ${resultText}`);
        document.getElementById('choices-area').innerHTML = '';
        this.state.history.push({ age: this.state.age, event: event.title, choice: choice.text });

        // 处理连锁事件
        if (event.chain && event.chainStep) {
            const cs = this.state.chainState[event.chain] || { step: 0, len: event.chainLen || 3 };
            cs.step = event.chainStep;
            cs.len = event.chainLen || 3;
            this.state.chainState[event.chain] = cs;
            if (event.chainStep < cs.len) {
                const nextId = `${event.chain}_${event.chainStep + 1}`;
                const nextEvt = EVENTS_POOL.find(e => e.id === nextId);
                if (nextEvt) {
                    this.addLog('system', `🔗 连锁事件已触发，后续事件将在之后到来……`);
                    this.state.pendingChain = nextId;
                }
            }
        }

        // 终局事件
        if (event.id === 'final_ban') { setTimeout(() => this.endGame(), 500); return; }

        // 总选择耗尽
        if (this.state.totalChoices >= this.state.maxTotalChoices) {
            this.addLog('negative', `⛔ 抉择次数用尽（${this.state.totalChoices}/${this.state.maxTotalChoices}）。命运不再给你选择的机会。`);
            if (!this.state.finalTriggered) this.state.eventCount = this.state.maxEvents;
            setTimeout(() => this.triggerEvent(), 400);
            return;
        }

        this.advanceYears(this.state.mode === 'fast' ? 5 : 2);
        if (this.state.health <= 0) { this.addLog('negative', '💀 槟榔最终夺走了你的生命。'); this.endGame(); return; }
        if (this.state.age >= 70) { this.addLog('system', '👴 人生迟暮。你终于不用再嚼那东西了。'); this.endGame(); return; }
        setTimeout(() => this.triggerEvent(), 400);
    }

    retire() { if (this.state.ended) return; this.addLog('system', '🏁 你选择了提前退出。但那些被你害过的人，无法退出。'); this.endGame(); }

    endGame() {
        this.state.ended = true;
        document.getElementById('choices-area').innerHTML = '';
        const { title, desc } = this.calculateEnding();
        this.state.endingTitle = title; this.state.endingDesc = desc;
        this.saveToHistory();
        setTimeout(() => {
            this.renderSummaryCard();
            document.getElementById('game-screen').classList.remove('active');
            document.getElementById('ending-screen').classList.add('active');
            document.getElementById('ending-title').textContent = title;
        }, 600);
    }

    calculateEnding() {
        const s = this.state;
        // 所有终局都是悲惨的失败
        if (s.quitEnding) {
            // 这个分支不会被调用（quit在applyChoice中直接处理），保留以防万一
            return { title: s.endingTitle || '🙏 金盆洗手', desc: s.endingDesc || '你逃出了槟榔江湖。' };
        }
        if (s.finalTriggered) {
            if (s.health <= 15) return {
                title: '💀 槟榔陪葬',
                desc: '取缔令下来那天，你正在医院做化疗。口腔癌晚期，半边脸已经烂得不成样子。你用半条命换来的积蓄，全扔进了医院。咽气前你含糊不清地说了句什么——护士猜是"后悔"，也可能只是"疼"。槟榔江湖最后一个牺牲品，就是你自己。'
            };
            if (s.guilt >= 50) return {
                title: '🔥 罪有应得',
                desc: '你明知槟榔致癌，却从不提醒顾客。你往卤水里加工业石灰，往配方里掺上瘾成分。产业取缔那天，你不仅失去了一切，还被查出多项违法。你在铁窗里度过了最后的日子，没有一个人来探视。狱友问你是干什么的，你张了张嘴，没脸说。'
            };
            if (s.money >= 40) return {
                title: '🏃 携款跑路',
                desc: '你在取缔前转移了资产。换了城市，改了名字，做起了别的生意。但每个深夜，你都会梦到那些嚼着你的槟榔患上癌症的脸。钱是保住了，但你从此不敢照镜子。你成了一个有钱的逃犯，逃的不是法律，是自己的良心。'
            };
            if (s.guilt >= 30) return {
                title: '🍂 身败名裂',
                desc: '槟榔产业被全面取缔。你的作坊关停，存货被销毁。有人把你过去的"事迹"发到了网上——工业石灰、学生套餐、虚假宣传。你走在街上被人认出来，被人指着鼻子骂"害人精"。你连门都不敢出了。'
            };
            return {
                title: '🫥 一无所有',
                desc: '封条贴上的那一刻，你才发现自己什么都没有了。钱没攒下，身体毁了，家人早就被你气走了。你蹲在店门口，看着执法人员把槟榔一箱箱搬走。一辈子就干了这一件事，现在这件事被定性为犯罪。你连后悔的力气都没有了。'
            };
        }
        // 非终局结局（健康/年龄原因提前结束）
        if (s.health <= 10) return {
            title: '💀 死于槟榔',
            desc: '口腔癌晚期。你最后的遗言含糊不清，因为舌头已经被切掉了大半。家人把你的槟榔存货全扔进了河里。葬礼上没什么人——认识你的人要么也得了癌症，要么早就跟你断了来往。'
        };
        if (s.guilt >= 60) return {
            title: '😈 槟榔恶魔',
            desc: '你一生都在榨取他人健康换取财富。你的"秘方"让无数人上瘾，你明知致癌却从不收手。你赚的钱堆成了山，但你的良心早已烂成了泥。临死前你还在嚼槟榔，嘴角的血水流到了枕头上。'
        };
        return {
            title: '🫥 随波逐流',
            desc: '你只是一个普通的槟榔从业者。没害过太多人，也没救过什么人。随大流地做槟榔、卖槟榔、嚼槟榔。你的一生就像一颗被嚼烂的槟榔——被人吐在地上，太阳一晒，什么都没留下。'
        };
    }

    renderSummaryCard() {
        const canvas = document.getElementById('summary-canvas');
        const ctx = canvas.getContext('2d'); const W = 360, H = 560; const s = this.state;
        const origin = ORIGINS[s.origin];
        const isQuit = s.quitEnding;
        const isDark = !isQuit && (s.finalTriggered || s.guilt >= 40);

        const grad = ctx.createLinearGradient(0, 0, 0, H);
        if (isQuit) { grad.addColorStop(0, '#0a1a0a'); grad.addColorStop(0.5, '#0a1a12'); grad.addColorStop(1, '#050f05'); }
        else { grad.addColorStop(0, isDark ? '#1a0a0a' : '#1a1a2e'); grad.addColorStop(0.5, isDark ? '#0f0505' : '#16213e'); grad.addColorStop(1, isDark ? '#080202' : '#0f0f23'); }
        ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

        const borderC = isQuit ? '#27ae60' : (isDark ? '#c0392b' : '#8B4513');
        ctx.strokeStyle = borderC; ctx.lineWidth = 2; ctx.strokeRect(10, 10, W - 20, H - 20);
        ctx.strokeStyle = isQuit ? 'rgba(39,174,96,0.3)' : (isDark ? 'rgba(192,57,43,0.3)' : 'rgba(139,69,19,0.3)');
        ctx.lineWidth = 1; ctx.strokeRect(16, 16, W - 32, H - 32);

        this.drawBetelNut(ctx, W / 2 - 70, 28);
        ctx.fillStyle = '#f1c40f'; ctx.font = 'bold 22px "PingFang SC","Microsoft YaHei",sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('槟榔江湖', W / 2 + 10, 55);
        ctx.fillStyle = '#95a5a6'; ctx.font = '13px sans-serif'; ctx.fillText('—— 一颗槟榔的罪恶史 ——', W / 2, 78);
        ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(40, 95); ctx.lineTo(W - 40, 95); ctx.stroke();

        let y = 120;
        ctx.fillStyle = '#ecf0f1'; ctx.font = '14px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText(`出身：${origin.icon} ${origin.name}`, 40, y); y += 26;
        ctx.fillText(`生涯：${s.age}岁 · ${s.year}年`, 40, y); y += 26;
        ctx.fillText(`种子：${s.seed}`, 40, y);
        y += 35;

        ctx.fillStyle = '#f1c40f'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('— 生涯结算 —', W / 2, y); y += 28;

        const stats = [
            { label: '技艺', val: s.skill, color: '#8B4513', icon: '🔧' },
            { label: '人脉', val: s.network, color: '#7f8c8d', icon: '👥' },
            { label: '积蓄', val: s.money, color: '#27ae60', icon: '💰' },
            { label: '健康', val: s.health, color: '#e74c3c', icon: '❤️' },
            { label: '罪孽', val: s.guilt, color: '#2c3e50', icon: '💀' }
        ];
        stats.forEach(stat => {
            const bx = 90, bw = W - 130, bh = 14, by = y;
            ctx.fillStyle = '#95a5a6'; ctx.font = '11px sans-serif'; ctx.textAlign = 'right'; ctx.fillText(`${stat.icon} ${stat.label}`, bx - 8, by + 11);
            ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 4); ctx.fill();
            ctx.fillStyle = stat.color; ctx.beginPath(); ctx.roundRect(bx, by, bw * Math.min(stat.val / 100, 1), bh, 4); ctx.fill();
            ctx.fillStyle = '#ecf0f1'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText(stat.val, bx + bw + 6, by + 11);
            y += 24;
        });
        y += 18;

        ctx.fillStyle = '#f1c40f'; ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('终局', W / 2, y); y += 26;
        ctx.fillStyle = isQuit ? '#2ecc71' : (isDark ? '#e74c3c' : '#D2691E'); ctx.font = 'bold 19px sans-serif'; ctx.fillText(s.endingTitle, W / 2, y); y += 28;
        ctx.fillStyle = '#bdc3c7'; ctx.font = '11px sans-serif';
        this.wrapText(ctx, s.endingDesc, W - 70).forEach(line => { ctx.fillText(line, W / 2, y); y += 18; });

        y = H - 45;
        ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
        this.drawBetelNut(ctx, W / 2 - 48, y - 22);
        ctx.fillText('槟榔江湖 · 警示录', W / 2 + 5, y);
        ctx.fillText(isQuit ? '回头是岸，为时不晚' : '珍爱生命，远离槟榔', W / 2, y + 16);
    }

    drawBetelNut(ctx, x, y) {
        ctx.save(); const cx = x, cy = y + 18;
        ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(cx + 2, cy + 14, 12, 18, 0, 0, Math.PI * 2); ctx.fill();
        const grad = ctx.createRadialGradient(cx - 3, cy - 6, 2, cx, cy, 18);
        grad.addColorStop(0, '#c48a5c'); grad.addColorStop(0.2, '#a0714f'); grad.addColorStop(0.55, '#7a4a2e'); grad.addColorStop(0.85, '#5c3018'); grad.addColorStop(1, '#3a1a0a');
        ctx.fillStyle = grad; ctx.beginPath(); ctx.ellipse(cx, cy, 13, 18, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(cx - 10, cy - 8); ctx.quadraticCurveTo(cx, cy - 10, cx + 10, cy - 8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - 11, cy - 2); ctx.quadraticCurveTo(cx, cy - 4, cx + 11, cy - 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - 11, cy + 4); ctx.quadraticCurveTo(cx, cy + 2, cx + 11, cy + 4); ctx.stroke();
        const shine = ctx.createRadialGradient(cx - 3, cy - 5, 1, cx, cy, 12);
        shine.addColorStop(0, 'rgba(255,255,255,0.35)'); shine.addColorStop(0.5, 'rgba(255,255,255,0.08)'); shine.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = shine; ctx.beginPath(); ctx.ellipse(cx, cy, 13, 18, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.arc(cx - 5, cy - 7, 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.beginPath(); ctx.arc(cx - 3, cy - 10, 1.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.beginPath(); ctx.ellipse(cx + 4, cy + 7, 6, 9, 0.3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#5a3a1e'; ctx.fillRect(cx - 1, cy - 18, 2, 6);
        ctx.fillStyle = '#3a7a2e'; ctx.beginPath(); ctx.moveTo(cx, cy - 14); ctx.quadraticCurveTo(cx + 14, cy - 24, cx + 20, cy - 12); ctx.quadraticCurveTo(cx + 12, cy - 16, cx, cy - 14); ctx.fill();
        ctx.fillStyle = '#4a9a3e'; ctx.beginPath(); ctx.moveTo(cx, cy - 14); ctx.quadraticCurveTo(cx + 8, cy - 20, cx + 12, cy - 14); ctx.quadraticCurveTo(cx + 6, cy - 16, cx, cy - 14); ctx.fill();
        ctx.restore();
    }

    wrapText(ctx, text, maxW) {
        const lines = []; let line = '';
        for (const ch of text) { const t = line + ch; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = ch; } else line = t; }
        if (line) lines.push(line); return lines;
    }

    updateUI() {
        document.getElementById('game-age').textContent = this.state.age;
        document.getElementById('game-year').textContent = this.state.year;
        document.getElementById('game-choices').textContent = this.state.totalChoices;
        document.getElementById('game-max-choices').textContent = this.state.maxTotalChoices;
        const stage = getStage(this.state.age);
        document.getElementById('game-stage').textContent = stage.name;
        document.getElementById('game-stage').style.background = `rgba(${this.hexToRgb(stage.color)},0.2)`;
        document.getElementById('game-stage').style.color = stage.color;
        this.state.stage = stage.name;
        ['skill','network','money','health'].forEach(s => {
            document.getElementById(`stat-${s}`).style.width = (this.state[s] || 0) + '%';
            document.getElementById(`val-${s}`).textContent = this.state[s] || 0;
        });
        const gs = document.getElementById('stat-guilt'); if (gs) gs.style.width = (this.state.guilt || 0) + '%';
        const gv = document.getElementById('val-guilt'); if (gv) gv.textContent = this.state.guilt || 0;
        const hf = document.getElementById('stat-health');
        if (this.state.health < 25) hf.style.background = '#e74c3c';
        else if (this.state.health < 50) hf.style.background = '#f39c12';
        else hf.style.background = '#27ae60';
    }

    hexToRgb(h) { const r = parseInt(h.slice(1,3),16), g = parseInt(h.slice(3,5),16), b = parseInt(h.slice(5,7),16); return `${r},${g},${b}`; }

    addLog(type, html) {
        const log = document.getElementById('event-log');
        const e = document.createElement('div'); e.className = `log-entry ${type}`; e.innerHTML = html;
        log.appendChild(e); log.scrollTop = log.scrollHeight;
    }

    formatEffects(effects) {
        return Object.entries(effects).map(([k,v]) => `${this.getStatName(k)} ${v>0?'+':''}${v}`).join(' · ');
    }

    getStatName(k) { return { skill:'技艺', network:'人脉', money:'积蓄', health:'健康', guilt:'罪孽' }[k] || k; }

    saveToHistory() {
        const recs = JSON.parse(localStorage.getItem('bljh2_history') || '[]');
        recs.unshift({ seed:this.state.seed, origin:this.state.origin, age:this.state.age, year:this.state.year, title:this.state.endingTitle, desc:this.state.endingDesc, stats:{ skill:this.state.skill, network:this.state.network, money:this.state.money, health:this.state.health, guilt:this.state.guilt }, mode:this.state.mode, time:new Date().toLocaleString() });
        if (recs.length > 20) recs.length = 20;
        localStorage.setItem('bljh2_history', JSON.stringify(recs));
    }

    loadHistory() {
        const recs = JSON.parse(localStorage.getItem('bljh2_history') || '[]');
        const list = document.getElementById('history-list');
        if (!recs.length) { list.innerHTML = '<p class="empty-hint">暂无存档。每一局都是一次警示。</p>'; return; }
        list.innerHTML = recs.map((r,i) => `<div class="history-item" data-idx="${i}"><div><div class="hi-title">${r.title}</div><div class="hi-seed">种子:${r.seed} | ${ORIGINS[r.origin]?.name||'?'} | ${r.age}岁 | ${r.time}</div></div><span class="hi-delete" data-idx="${i}">🗑️</span></div>`).join('');
        list.querySelectorAll('.history-item').forEach(item => item.addEventListener('click', e => { if (e.target.classList.contains('hi-delete')) return; this.viewHistoryRecord(recs[parseInt(item.dataset.idx)]); }));
        list.querySelectorAll('.hi-delete').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); const i = parseInt(btn.dataset.idx); recs.splice(i,1); localStorage.setItem('bljh2_history', JSON.stringify(recs)); this.loadHistory(); this.showToast('已删除'); }));
    }

    viewHistoryRecord(r) {
        this.state = { age:r.age, year:r.year, skill:r.stats.skill, network:r.stats.network, money:r.stats.money, health:r.stats.health, guilt:r.stats.guilt, origin:r.origin, seed:r.seed, rng:new SeededRandom(r.seed), mode:r.mode, stage:getStage(r.age).name, history:[], ended:true, endingTitle:r.title, endingDesc:r.desc, eventCount:0, maxEvents:0, totalChoices:0, maxTotalChoices:0, finalTriggered:true, quitEnding: r.title.includes('金盆洗手') || r.title.includes('回归田园') || r.title.includes('幡然醒悟') || r.title.includes('浴火重生'), foreshadow:{}, chainState:{}, pendingChain:null };
        this.renderSummaryCard();
        document.getElementById('modal-history').classList.remove('active');
        document.getElementById('home-screen').classList.remove('active');
        document.getElementById('game-screen').classList.remove('active');
        document.getElementById('ending-screen').classList.add('active');
        document.getElementById('ending-title').textContent = r.title;
    }

    shareCard() {
        const canvas = document.getElementById('summary-canvas');
        canvas.toBlob(blob => {
            if (navigator.share) { navigator.share({ title:'槟榔江湖 - 警示录', files:[new File([blob],'binglang.png',{type:'image/png'})] }).catch(()=>{}); }
            else { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='binglang.png'; a.click(); URL.revokeObjectURL(url); this.showToast('警示卡已保存！'); }
        }, 'image/png');
    }

    restart() {
        document.getElementById('ending-screen').classList.remove('active');
        document.getElementById('game-screen').classList.remove('active');
        document.getElementById('home-screen').classList.add('active');
        document.getElementById('event-log').innerHTML = '<div class="log-entry system">📜 一颗槟榔的罪恶史，即将开始……</div>';
        document.getElementById('choices-area').innerHTML = '';
    }

    showToast(msg) {
        const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show');
        clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2000);
    }
}

document.addEventListener('DOMContentLoaded', () => new Game());
