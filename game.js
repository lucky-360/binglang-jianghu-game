// ========== 种子随机数 ==========
class SeededRandom {
    constructor(seed) { this.seed = seed; }
    next() { this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff; return this.seed / 0x7fffffff; }
    nextInt(min, max) { return Math.floor(this.next() * (max - min + 1)) + min; }
    pick(arr) { return arr[Math.floor(this.next() * arr.length)]; }
}

// ========== 出身系统 ==========
const ORIGINS = {
    xiangtan: {
        name: '湘潭学徒', icon: '🏭',
        skill: 30, network: 15, money: 8, health: 78, guilt: 3,
        desc: '你从小在湘潭的槟榔作坊长大。师傅说这行来钱快，你信了。你学会的第一件事不是做槟榔，是往卤水里多加石灰。'
    },
    changsha: {
        name: '长沙商贩', icon: '🏙️',
        skill: 12, network: 35, money: 20, health: 68, guilt: 10,
        desc: '省城的夜市里，你的槟榔摊挨着臭豆腐和糖油粑粑。你认识这条街上的每一个老顾客——他们的腮帮子一个比一个大。'
    },
    yiyang: {
        name: '益阳农户', icon: '🌾',
        skill: 18, network: 8, money: 6, health: 88, guilt: 2,
        desc: '你家在益阳乡下种槟榔树。你爹说这东西比水稻赚钱十倍。你不知道城里人嚼这个嚼烂了多少张嘴。'
    },
    wailai: {
        name: '外来闯荡', icon: '🚶',
        skill: 5, network: 5, money: 2, health: 82, guilt: 0,
        desc: '你从外省来到湖南打工，在工地听工友说槟榔"提神"。你试了一颗，然后看到了商机——工地几百号人，每天都嚼。'
    }
};

function getStage(age) {
    if (age < 22) return { name: '入行期', color: '#7f8c8d' };
    if (age < 32) return { name: '扩张期', color: '#e67e22' };
    if (age < 45) return { name: '巅峰期', color: '#c0392b' };
    if (age < 55) return { name: '衰退期', color: '#8e44ad' };
    return { name: '终末期', color: '#2c3e50' };
}

function getPhase(age) {
    if (age < 22) return 'early';
    if (age < 45) return 'mid';
    return 'late';
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
    },
    first_taste: {
        pixels: ['....................','.......WWWW........','......WYYYYW.......','.....WY8888YW......','....WY888888YW.....','...WY88888888YW....','..WY8888888888YW...','.WY888888888888YW..','.WY88PPPPPP8888YW..','.WY8P888888P888YW..','..WYP888888P88YW...','...WYP88888P8YW....','....WYPPPPP8YW.....','.....WY8888YW......','......WYYYYW.......','.......WWWW........','....................'],
        colors: { W:'#8B4513', Y:'#D2691E', 8:'#2ecc71', P:'#e74c3c' }
    },
    lime_secret: {
        pixels: ['....................','.......GGGG........','......G8888G.......','.....G888888G......','....G88888888G.....','...G88WWWWWW88G....','..G88WW8888WW88G...','.G88WW888888WW88G..','.G8WW88888888WW8G..','.G8W8888888888W8G..','.G8W8888888888W8G..','.G8W8888888888W8G..','..GWW88888888WWG...','...GWW888888WWG....','....GWWWWWWWWG.....','.....GGGGGGGG......','....................'],
        colors: { G:'#7f8c8d', 8:'#bdc3c7', W:'#ecf0f1' }
    },
    customer_cancer: {
        pixels: ['....................','......RRRRRR.......','.....RRRRRRRR......','....RR888888RR.....','...RR88888888RR....','..RR8888888888RR...','.RR88PPPPPP8888RR..','.RR8PP8888PP888RR..','.RRP88888888P88RR..','.RRP88888888P88RR..','.RRP88888888P88RR..','..RRPP888888PPRR...','...RRPPPPPPPPRR....','....RRRRRRRRRR.....','.....RRRRRRRR......','......RRRRRR.......','....................'],
        colors: { R:'#c0392b', 8:'#e74c3c', P:'#f5b7b1' }
    }
};

// ========== 事件系统 ==========
// phase: 'early'=前期14-22, 'mid'=中期23-44, 'late'=后期45-55
// originFilter: null=所有出身, 数组=特定出身
// type: 'normal'=普通选择, 'probability'=概率, 'rps'=猜拳, 'foreshadow'=伏笔, 'chain'=连锁, 'blind'=盲盒
// 注意: 伏笔类不显示标签, 盲盒类不显示标签, 概率类显示概率

const ALL_EVENTS = [
    // ==================== 前期事件 (14-22岁) ~22个 ====================
    {
        id: 'first_taste', phase: 'early', originFilter: null,
        title: '第一口槟榔', image: 'first_taste',
        desc: '师傅递给你一颗槟榔："尝尝，干这行不嚼槟榔，说出去让人笑话。"你看着那颗黑褐色的东西，闻到一股刺鼻的石灰味。',
        choices: [
            { text: '接过槟榔，嚼了起来', effects: { skill: 5, health: -8, guilt: 8 }, result: '辛辣直冲脑门，一阵眩晕后是莫名的兴奋。从这天起，你再也离不开这东西了。', type: 'normal' },
            { text: '婉拒："我不吃这个"', effects: { health: 5, guilt: -5 }, result: '师傅脸色一沉："不吃槟榔还想做槟榔？"你被安排去干最脏最累的活。但你的口腔是干净的。', type: 'normal' },
            { text: '犹豫了一下，说"试试看"', effects: {}, result: '', type: 'blind', blind: [
                { effects: { skill: 3, health: -3 }, result: '嚼了两口就吐了，太呛。师傅摇头叹气。', weight: 45 },
                { effects: { skill: 8, health: -10, guilt: 12 }, result: '一口下去你就爱上了。从此每天不嚼几十颗浑身难受。', weight: 55 }
            ] }
        ]
    },
    {
        id: 'lime_secret', phase: 'early', originFilter: null,
        title: '石灰的秘密', image: 'lime_secret',
        desc: '你发现师傅在卤水里加了一种白色粉末，比正常用量多得多。师傅说这叫"劲大"——加得越多，回头客越多。',
        choices: [
            { text: '默默记下配方', effects: { skill: 10, guilt: 12, health: -3 }, result: '你学会了这个"秘方"。以后你的槟榔比别人更让人上瘾。', type: 'normal' },
            { text: '质问师傅是否安全', effects: { skill: 3, network: -5 }, result: '师傅大怒："你懂什么！不这样哪来的回头客！"你被罚扫了一个月的地。', type: 'normal' },
            { text: '偷偷少放一点试试', effects: {}, result: '', type: 'blind', blind: [
                { effects: { skill: 5, guilt: -3 }, result: '少放石灰后味道温和了些，意外吸引了一批不喜欢太冲的顾客。', weight: 35 },
                { effects: { skill: -3, money: -5 }, result: '老顾客抱怨"没劲"，流失了一批熟客。师傅气得摔了你的配方本。', weight: 65 }
            ] }
        ]
    },
    {
        id: 'apprentice_bully', phase: 'early', originFilter: ['xiangtan'],
        title: '同门之争',
        desc: '师兄看你学得快，心生嫉妒。他在师傅面前说你偷工减料，师傅罚你三天不准吃饭。你饿得头昏眼花。',
        choices: [
            { text: '忍气吞声，加倍努力', effects: { skill: 8, health: -5 }, result: '你用实力证明了自己。三个月后你的手艺超过了师兄，师傅开始让你独立配料。', type: 'normal' },
            { text: '找师兄理论', effects: {}, result: '', type: 'blind', blind: [
                { effects: { network: -5, health: -3 }, result: '师兄恼羞成怒动了手，你被打得鼻青脸肿。师傅各打五十大板。', weight: 55 },
                { effects: { network: 3, skill: 3 }, result: '师兄被你的气势镇住了，反而对你客气起来。', weight: 45 }
            ] }
        ]
    },
    {
        id: 'market_first', phase: 'early', originFilter: ['changsha'],
        title: '夜市初体验',
        desc: '你在长沙夜市摆下第一个槟榔摊。隔壁卖臭豆腐的大姐看了你一眼："小伙子，卖这个不怕遭报应？"',
        choices: [
            { text: '"混口饭吃而已"', effects: { money: 8, network: 5, guilt: 5 }, result: '第一天生意不错。夜市的年轻人三三两两来买，你的槟榔比隔壁的便宜。', type: 'normal' },
            { text: '"大姐，要不要合作？买臭豆腐送槟榔"', effects: { money: 12, network: 10, guilt: 10 }, result: '捆绑营销效果出奇地好。臭豆腐的辣加上槟榔的冲，年轻人说"上头"。', type: 'normal' },
            { text: '被她说得心里发毛', effects: { guilt: -8, money: 3 }, result: '你犹豫了一晚上，最后把槟榔定价调高了些——"至少少卖几颗"。', type: 'normal' }
        ]
    },
    {
        id: 'village_plant', phase: 'early', originFilter: ['yiyang'],
        title: '槟榔树下',
        desc: '你爹带你看家里的槟榔园："这二十亩地，种水稻一年赚八千，种槟榔一年赚五万。你说种哪个？"',
        choices: [
            { text: '扩大种植规模', effects: { skill: 5, money: 8, guilt: 8 }, result: '你家又承包了十亩地。满山的槟榔树绿油油的，你爹笑得合不拢嘴。', type: 'normal' },
            { text: '学深加工，做成品槟榔', effects: { skill: 10, money: -3, guilt: 5 }, result: '你开始研究卤水配方。从种槟榔到做槟榔，你离"源头"越来越近了。', type: 'normal' },
            { text: '"爹，咱种别的吧"', effects: { guilt: -10, money: -5 }, result: '你爹一巴掌扇过来："败家子！"但你心里知道，你说的是对的。', type: 'foreshadow', foreshadowId: 'doubt_early' }
        ]
    },
    {
        id: 'migrant_start', phase: 'early', originFilter: ['wailai'],
        title: '工地初遇',
        desc: '你在建筑工地搬砖，工友递给你一颗槟榔："嚼一颗，提神！比红牛管用。"你半信半疑地接过来。',
        choices: [
            { text: '嚼了，然后看到商机', effects: { skill: 3, money: 5, guilt: 5 }, result: '一颗槟榔让你兴奋了两个小时。你注意到工地几百号人几乎人人都嚼——这是多大的市场。', type: 'normal' },
            { text: '拒绝，但开始观察', effects: { skill: 5, health: 3 }, result: '你没嚼，但你发现工友们每天花在槟榔上的钱比饭钱还多。你开始偷偷记下他们的购买渠道。', type: 'normal' },
            { text: '嚼了，上瘾了', effects: { skill: 2, health: -10, guilt: 8 }, result: '一颗接一颗，你成了工地上嚼得最凶的那个。牙齿开始发黑，嘴角开始溃烂，但你不在乎。', type: 'normal' }
        ]
    },
    {
        id: 'first_recipe', phase: 'early', originFilter: null,
        title: '秘方传承',
        desc: '师傅把你叫到跟前："我要把祖传的卤水配方教给你。但你要发誓——这辈子只做槟榔，不做别的。"',
        choices: [
            { text: '发誓，接过配方', effects: { skill: 15, guilt: 10 }, result: '配方里有你从没听过的材料。师傅说："这些都是能让顾客回头的宝贝。"你后来才知道其中几种是违禁添加物。', type: 'normal' },
            { text: '"师傅，能不能改良一下？"', effects: { skill: 8, guilt: -5, network: -5 }, result: '师傅脸色铁青："改良？我爷爷的爷爷就是这么做的！"你虽然没拿到完整配方，但守住了一些底线。', type: 'normal' },
            { text: '假装发誓，心里另有打算', effects: { skill: 10, guilt: 3 }, result: '你拿到了配方，但心里想的是——将来我要做出自己的品牌。', type: 'foreshadow', foreshadowId: 'own_brand' }
        ]
    },
    {
        id: 'young_addict', phase: 'early', originFilter: null,
        title: '少年顾客',
        desc: '一个穿着校服的初中生站在你摊位前，掏出皱巴巴的五块钱。你注意到他嘴唇已经被槟榔染成了暗红色——这不是他第一次买。',
        choices: [
            { text: '拒绝卖给他', effects: { money: -3, guilt: -12 }, result: '少年骂骂咧咧走了。旁边摊贩笑你傻，但你觉得对得起良心。', type: 'normal' },
            { text: '卖给他，不废话', effects: { money: 5, guilt: 15 }, result: '少年熟练地拆开包装嚼了起来。你想起了自己第一次嚼槟榔的样子——那年你也差不多大。', type: 'normal' },
            { text: '卖给他，但劝一句"少嚼点"', effects: { money: 5, guilt: 8 }, result: '少年不耐烦地摆摆手走了。你说的话他一个字都没听进去。', type: 'normal' }
        ]
    },
    {
        id: 'gov_notice', phase: 'early', originFilter: null,
        title: '一纸通知',
        desc: '市场监管所贴出通知：槟榔制品不得宣传医疗功效，不得向未成年人销售。同行们都在骂"管得宽"。',
        choices: [
            { text: '遵守规定，撤下虚假广告', effects: { money: -5, guilt: -10 }, result: '你是街上唯一照做的。虽然短期收入降了，但后来检查时你成了正面典型。', type: 'normal' },
            { text: '换种说法打擦边球', effects: { money: 5, skill: 3, guilt: 5 }, result: '你把"提神醒脑"改成"元气满满"，把"治疗口臭"改成"清新口气"。监管拿你没办法。', type: 'normal' },
            { text: '无视通知', effects: {}, result: '', type: 'probability', probability: [
                { effects: { money: 8, guilt: 8 }, result: '一段时间没人管，你以为风头过去了。', chance: 55 },
                { effects: { money: -12, guilt: 10, network: -5 }, result: '突击检查，罚款八千，还被列入重点监管名单。', chance: 45 }
            ] }
        ]
    },
    {
        id: 'first_competitor', phase: 'early', originFilter: null,
        title: '同行来袭',
        desc: '你对面新开了一家槟榔店，老板是个从广东回来的年轻人，槟榔包装精美，还找了网红带货。你的生意一下子少了一半。',
        choices: [
            { text: '降价竞争', effects: { money: -8, skill: 3 }, result: '价格战打了三个月，两边都亏了不少。但你活下来了。', type: 'normal' },
            { text: '差异化经营，主打"老味道"', effects: { skill: 8, money: 3 }, result: '你打出"三十年老配方"的招牌，反而吸引了一批怀旧的老顾客。', type: 'normal' },
            { text: '联合其他同行抵制', effects: { network: 10, skill: 3, guilt: 8 }, result: '你们成立了"老街槟榔联盟"，统一价格、划分地盘。新来的终于扛不住走了。', type: 'normal' }
        ]
    },
    {
        id: 'wife_meet', phase: 'early', originFilter: null,
        title: '相亲',
        desc: '家里给你安排了相亲。姑娘长得清秀，在镇上超市做收银员。聊着聊着她问你："你是做什么的？"',
        choices: [
            { text: '老实说做槟榔的', effects: {}, result: '', type: 'blind', blind: [
                { effects: { network: 5 }, result: '姑娘愣了一下，说"我哥也嚼槟榔"。你们聊得还不错。', weight: 50 },
                { effects: { network: -3, guilt: 5 }, result: '姑娘脸色变了："我爸就是嚼槟榔得口腔癌走的。"相亲不欢而散。', weight: 50 }
            ] },
            { text: '含糊说"做食品加工的"', effects: { network: 8, guilt: 5 }, result: '姑娘没追问。你们交往了半年，她才知道真相——但已经来不及了。', type: 'foreshadow', foreshadowId: 'lied_to_wife' },
            { text: '反问她对槟榔的看法', effects: { network: 3, guilt: -3 }, result: '她说不喜欢槟榔味。你说你也是。但你没告诉她你就是做这个的。', type: 'normal' }
        ]
    },
    {
        id: 'friends_try', phase: 'early', originFilter: null,
        title: '朋友入坑',
        desc: '你的发小来找你玩，看见你嚼槟榔觉得新鲜："给我来一颗试试。"你知道这东西会上瘾。',
        choices: [
            { text: '给他一颗', effects: { network: 5, guilt: 10, money: 2 }, result: '发小嚼完说"带劲"，从此成了你的忠实顾客。三年后他口腔出了问题，你假装不知道。', type: 'normal' },
            { text: '"别试，会上瘾的"', effects: { network: 5, guilt: -8 }, result: '发小不理解但尊重你。你们喝了顿酒，聊了些别的。他没有走上嚼槟榔的路。', type: 'normal' },
            { text: '给他一颗但警告他', effects: { network: 3, guilt: 3 }, result: '你给了他一颗但说了危害。他说"就试一颗怕什么"。后来他确实没上瘾——只是因为他觉得太难吃了。', type: 'normal' }
        ]
    },
    {
        id: 'cheap_supplier', phase: 'early', originFilter: null,
        title: '廉价货源',
        desc: '一个供应商找到你，说他的槟榔干比市场价低三成。"都是缅甸过来的，质量没问题。"你检查了一下——颜色发黑，有明显霉味。',
        choices: [
            { text: '贪便宜进货', effects: { money: 15, guilt: 15, health: -5 }, result: '霉变的槟榔干你用香精盖住了味道。顾客没发现，但你每晚都做噩梦。', type: 'normal' },
            { text: '拒绝，坚持用正品', effects: { money: -3, guilt: -5 }, result: '供应商骂你不识抬举走了。你的成本比别人高，但你的槟榔品质是最好的。', type: 'normal' },
            { text: '举报给工商', effects: { network: 10, guilt: -10, money: -3 }, result: '工商端掉了那个走私窝点。同行们不知道是你举报的，但你的良心知道。', type: 'foreshadow', foreshadowId: 'did_good' }
        ]
    },
    {
        id: 'skill_contest', phase: 'early', originFilter: null,
        title: '槟榔大赛',
        desc: '镇上举办了一年一度的"槟榔手艺大赛"，第一名能拿到市里的经销权。你摩拳擦掌报了名。',
        choices: [
            { text: '凭真本事参赛', effects: {}, result: '', type: 'blind', blind: [
                { effects: { skill: 12, network: 8, money: 10 }, result: '你做的槟榔征服了评委！拿了第一名，市里的大超市开始跟你订货。', weight: 40 },
                { effects: { skill: 5, network: 3 }, result: '高手如云，你拿了第三。但你的手艺被更多人看到了。', weight: 60 }
            ] },
            { text: '在卤水里加"猛料"', effects: { skill: 8, guilt: 20 }, result: '你的槟榔让评委"欲罢不能"，拿了第二名。但你知道这不是真本事——你的槟榔比别人的更让人上瘾。', type: 'normal' },
            { text: '不参赛，去偷师', effects: { skill: 8, guilt: 3 }, result: '你假装观众在赛场逛了一圈，把各家的配方特点记在心里。', type: 'normal' }
        ]
    },
    {
        id: 'health_first_warning', phase: 'early', originFilter: null,
        title: '第一次警告',
        desc: '你发现自己张嘴时脸颊有点酸胀，吃辣的东西时口腔火辣辣地疼。你对着镜子看了看——两颊内侧的黏膜白花花一片。',
        choices: [
            { text: '去医院检查', effects: { money: -5, health: 8 }, result: '医生说是口腔黏膜下纤维性变——槟榔引起的。癌前病变。医生严肃地让你立刻戒掉。', type: 'normal' },
            { text: '减少嚼的量', effects: { health: 3, guilt: 3 }, result: '你从每天五十颗减到三十颗。症状缓解了一些，但你没有完全戒掉。', type: 'normal' },
            { text: '"干这行的谁不这样"', effects: { health: -10, guilt: 5 }, result: '你没当回事。继续每天嚼，继续每天做，继续每天卖。', type: 'normal' }
        ]
    },
    {
        id: 'betray_teacher', phase: 'early', originFilter: ['xiangtan', 'yiyang'],
        title: '师傅的秘密',
        desc: '你无意中翻到师傅的进货单——他进的不是食品级石灰，而是工业石灰。价格差了十倍，毒性也差了十倍。',
        choices: [
            { text: '偷偷举报', effects: { guilt: -15, network: -15 }, result: '工商查封了作坊。师傅被抓了，你在同行中被孤立——"叛徒"的标签贴了你很久。但你觉得做对了。', type: 'foreshadow', foreshadowId: 'did_good' },
            { text: '以此为把柄要挟师傅', effects: { skill: 10, money: 10, guilt: 25 }, result: '师傅不得不在配方上让步。你掌握了作坊的话语权，但也掌握了一个见不得人的秘密。', type: 'normal' },
            { text: '装作不知道', effects: { guilt: 10, skill: 5 }, result: '你继续用工业石灰做槟榔。你告诉自己"又不是我进的货"。但你明明知道。', type: 'normal' }
        ]
    },
    {
        id: 'chain_smuggler_start', phase: 'early', originFilter: ['wailai', 'changsha'],
        title: '特殊的渠道（连锁1/3）',
        desc: '一个操着云南口音的人找到你："兄弟，我这有批缅甸槟榔干，价格只要市场价一半。但量大，你吃得下吗？"',
        chain: 'smuggler_chain', chainStep: 1, chainLen: 3,
        choices: [
            { text: '先拿一小批试试', effects: { money: 8, guilt: 10 }, result: '槟榔干质量还行，就是包装明显是走私的。那人留了个电话："想做大联系我。"', type: 'normal' },
            { text: '直接拒绝', effects: { guilt: -5 }, result: '那人耸耸肩走了。但你看到他去了隔壁老张的店。老张后来发了，你不知道是不是因为这个。', type: 'normal' },
            { text: '砍价拿下', effects: {}, result: '', type: 'rps', rps: {
                win: { effects: { money: 15, guilt: 12 }, result: '你硬是把价格又压了两成。那人说你是他见过最狠的。' },
                lose: { effects: { money: 5, guilt: 5 }, result: '没砍下来，但你还是拿了一批。反正比市场价便宜。' },
                tie: { effects: { money: 10, guilt: 8 }, result: '各退一步，成交。那人说下次还找你。' }
            } }
        ]
    },
    {
        id: 'chain_smuggler_2', phase: 'mid', originFilter: ['wailai', 'changsha'],
        title: '做大生意（连锁2/3）',
        desc: '云南人又来了，这次带了三个人。"兄弟，上次合作愉快。这次我有一整柜的货，你敢接吗？量大从优，但需要你先付一半定金。"',
        chain: 'smuggler_chain', chainStep: 2, chainLen: 3,
        choices: [
            { text: '接！富贵险中求', effects: { money: 20, guilt: 20 }, result: '一整柜的走私槟榔干到了。你成了这条街最大的槟榔供应商，其他摊贩都从你这拿货。但你不知道海关已经在查这条线了。', type: 'normal' },
            { text: '太冒险了，拒绝', effects: { guilt: -5, money: -5 }, result: '云南人脸色很难看地走了。你松了口气，但看着隔壁老张生意越做越大，心里不是滋味。', type: 'normal' },
            { text: '要求分期付款', effects: {}, result: '', type: 'blind', blind: [
                { effects: { money: 12, guilt: 12 }, result: '他同意了。你分三期付款，风险小了很多。但量也少了。', weight: 60 },
                { effects: { money: 15, guilt: 15 }, result: '他勉强同意但要求加一成利息。你答应了——反正利润够高。', weight: 40 }
            ] }
        ]
    },
    {
        id: 'chain_smuggler_3', phase: 'mid', originFilter: ['wailai', 'changsha'],
        title: '海关的敲门声（连锁3/3）',
        desc: '凌晨五点，有人猛敲你家门。打开门——海关缉私和公安站在门口。"你涉嫌参与槟榔干走私，请跟我们走一趟。"',
        chain: 'smuggler_chain', chainStep: 3, chainLen: 3,
        choices: [
            { text: '认罪，交代上线', effects: { money: -25, network: -20, guilt: -10 }, result: '你在看守所待了三个月。出来时，你的店铺被查封，积蓄被罚没。但你没有留下案底。', type: 'normal' },
            { text: '拒不认罪', effects: {}, result: '', type: 'probability', probability: [
                { effects: { money: -15, network: -10, guilt: 15 }, result: '证据不足，你被放了。但云南人以为你出卖了他，找人砸了你的店。', chance: 40 },
                { effects: { money: -35, network: -25, guilt: 20 }, result: '云南人落网后把你供出来了。罪加一等，判了两年。', chance: 60 }
            ] },
            { text: '花钱找律师', effects: { money: -20, network: -10 }, result: '律师帮你争取到缓刑。你不用坐牢但被限制经营。槟榔生意是做不下去了。', type: 'normal' }
        ]
    },
    {
        id: 'chain_mouth_1', phase: 'mid', originFilter: null,
        title: '张嘴困难（连锁1/3）',
        desc: '你发现自己张嘴越来越费劲，吃热的东西时口腔火辣辣地疼。对着镜子看——口腔黏膜白花花一片，像煮过的猪皮。',
        chain: 'mouth_chain', chainStep: 1, chainLen: 3,
        choices: [
            { text: '去医院检查', effects: { money: -8, health: 10 }, result: '医生严肃地告诉你：口腔黏膜下纤维性变，槟榔引起的癌前病变。必须立刻停止嚼槟榔。', type: 'normal' },
            { text: '自己买点消炎药', effects: { health: -5, money: -2, guilt: 5 }, result: '药吃了，症状缓解了几天。但你继续嚼槟榔，很快又复发了。', type: 'normal' },
            { text: '"干这行的谁嘴巴没点毛病"', effects: { health: -12, guilt: 10 }, result: '你没当回事。但口腔黏膜的病变正在加速。', type: 'normal' }
        ]
    },
    {
        id: 'chain_mouth_2', phase: 'mid', originFilter: null,
        title: '口腔溃烂（连锁2/3）',
        desc: '口腔的疼痛越来越严重。嘴里出现了无法愈合的溃疡，吃什么都疼。你瘦了一大圈。',
        chain: 'mouth_chain', chainStep: 2, chainLen: 3,
        choices: [
            { text: '终于去看医生', effects: { money: -15, health: 5, guilt: -10 }, result: '医生做了活检。你忐忑地等待结果。', type: 'normal' },
            { text: '加大槟榔量来麻痹疼痛', effects: { health: -20, guilt: 20 }, result: '嚼槟榔确实能暂时麻痹疼痛。但药效过后疼得更厉害。恶性循环。', type: 'normal' },
            { text: '试试偏方：白酒漱口', effects: {}, result: '', type: 'blind', blind: [
                { effects: { health: -8, guilt: 5 }, result: '白酒刺激得你眼泪直流，溃疡更严重了。', weight: 60 },
                { effects: { health: -3, guilt: 3 }, result: '心理作用让你觉得好了一些。但溃疡依旧。', weight: 40 }
            ] }
        ]
    },
    {
        id: 'chain_mouth_3', phase: 'late', originFilter: null,
        title: '确诊（连锁3/3）',
        desc: '活检结果出来了：早期口腔鳞状细胞癌。医生说必须手术切除部分组织，术后可能影响说话和进食。你瘫坐在医院走廊里。',
        chain: 'mouth_chain', chainStep: 3, chainLen: 3,
        choices: [
            { text: '接受手术，从此戒槟榔', effects: { health: -25, money: -30, skill: -10, guilt: -30 }, result: '手术成功了，但你失去了半边舌头。你再也不能流畅地说话，也做不了槟榔了。你把剩下的槟榔全烧了。', type: 'normal' },
            { text: '"反正都要死了，不如痛快嚼"', effects: { health: -40, guilt: 30 }, result: '你放弃了治疗。最后的日子你嘴里塞满了槟榔，嘴角流着血水。家人把你送进了临终关怀病房。', type: 'normal' },
            { text: '四处求医，花光积蓄', effects: { money: -40, health: -20, guilt: -10, network: 5 }, result: '你跑遍了各大医院。钱花光了，病也没治好。最后回到老家，在痛苦中度过余生。', type: 'normal' }
        ]
    },
    // ==================== 中期事件 (23-44岁) ~45个 ====================
    {
        id: 'customer_cancer', phase: 'mid', originFilter: null, image: 'customer_cancer',
        title: '老顾客的下巴',
        desc: '一个嚼了你家槟榔十几年的老顾客来找你。他张不开嘴了——口腔黏膜纤维化晚期。他求你："能不能做一款不那么伤人的？"他的眼神让你不敢直视。',
        choices: [
            { text: '良心发现，尝试减害配方', effects: { skill: 5, money: -10, guilt: -15 }, result: '你花了大半年改良配方。虽然利润薄了，但你终于能睡着觉了。', type: 'foreshadow', foreshadowId: 'did_good' },
            { text: '敷衍过去："多喝热水就好了"', effects: { money: 5, guilt: 18 }, result: '老顾客失望地走了。三个月后你听说他确诊了口腔癌。你告诉自己：又不是我逼他嚼的。', type: 'normal' },
            { text: '推荐他嚼"加强版"', effects: { money: 12, guilt: 28, health: -5 }, result: '你又卖出一批高价货。深夜你对着镜子，发现自己嘴角也已溃烂。', type: 'normal' }
        ]
    },
    {
        id: 'gov_ban_rumor', phase: 'mid', originFilter: null,
        title: '取缔传闻',
        desc: '网上开始流传：国家要全面禁止槟榔了。同行们人心惶惶，有人开始抛售存货，有人趁机压价囤货。',
        choices: [
            { text: '趁低价大量囤货', effects: {}, result: '', type: 'probability', probability: [
                { effects: { money: 20, skill: 5 }, result: '传闻是假的。槟榔价格很快涨回去，你大赚了一笔。', chance: 50 },
                { effects: { money: -20, guilt: 5 }, result: '传闻成真了一部分——槟榔被限制广告。价格暴跌，你囤的货烂在手里。', chance: 50 }
            ] },
            { text: '观望，按兵不动', effects: { skill: 3 }, result: '你选择观望。不管传闻真假，先把手头的生意做好。这是最稳妥的做法。', type: 'normal' },
            { text: '趁机转型，做减害槟榔', effects: { skill: 8, guilt: -10, money: -8 }, result: '你开始研发低石灰、低刺激的"健康槟榔"。虽然很多人不买账，但你走在了前面。', type: 'normal' }
        ]
    },
    {
        id: 'student_business', phase: 'mid', originFilter: null,
        title: '校园周边',
        desc: '一个网吧老板找到你，想在你这里大量批发槟榔卖给上网的学生。"学生熬夜打游戏，槟榔比咖啡好卖。量大，长期合作。"',
        choices: [
            { text: '签下这笔大单', effects: { money: 20, guilt: 25, network: 8 }, result: '网吧成了你的最大客户。每天几百个学生在那里通宵打游戏嚼槟榔。你想过他们的健康，但合同上的数字更让你兴奋。', type: 'normal' },
            { text: '"学生不能卖"', effects: { money: -5, guilt: -12, network: 5 }, result: '网吧老板翻了个白眼走了。但你的拒绝被同行传开了——有人骂你傻，有人说你有种。', type: 'normal' },
            { text: '要求他签"不卖未成年人"承诺', effects: { money: 10, guilt: 8, network: 8 }, result: '他签了，但你知道他不会遵守。你只是需要一个让自己心安的理由。', type: 'normal' }
        ]
    },
    {
        id: 'wife_ultimatum', phase: 'mid', originFilter: null,
        title: '妻子的最后通牒',
        desc: '你妻子把你堵在门口："你自己照照镜子！牙齿黑了，嘴巴烂了，天天嚼那破玩意。要么戒槟榔，要么我带孩子走。"她的眼睛里全是泪水。',
        choices: [
            { text: '下决心戒槟榔', effects: { health: 15, guilt: -10 }, result: '你痛苦地戒了三个月。但槟榔摊还在开——你只是自己不嚼了，继续卖给别人。', type: 'foreshadow', foreshadowId: 'quit_self' },
            { text: '"我卖这个赚钱养家！"', effects: { health: -8, network: -10, guilt: 10 }, result: '妻子摔门而去。你一个人坐在空荡荡的屋里嚼着槟榔，觉得格外带劲。', type: 'normal' },
            { text: '敷衍说"减量"，偷偷照嚼', effects: {}, result: '', type: 'blind', blind: [
                { effects: { health: -5, guilt: 5 }, result: '妻子没发现。但你自己知道——你根本戒不掉。', weight: 45 },
                { effects: { health: -10, network: -15, guilt: 15 }, result: '被发现了。妻子带着孩子回了娘家。你成了街坊嘴里的"槟榔鬼"。', weight: 55 }
            ] }
        ]
    },
    {
        id: 'chain_competitor_1', phase: 'mid', originFilter: null,
        title: '品牌战（连锁1/3）',
        desc: '一家大型槟榔企业在你对面开了旗舰店。包装精美、明星代言、买二送一。你的小店门可罗雀。',
        chain: 'competitor_chain', chainStep: 1, chainLen: 3,
        choices: [
            { text: '降价死扛', effects: { money: -12, skill: 5 }, result: '你咬牙降价，勉强留住了一些老顾客。但利润薄得可怜。', type: 'normal' },
            { text: '差异化：主打"传统手工"', effects: { skill: 10, money: 3, network: 5 }, result: '你打出"手工制作、古法传承"的招牌，意外吸引了一批追求"老味道"的顾客。', type: 'normal' },
            { text: '加入他们的加盟体系', effects: { money: 8, network: 5, guilt: 8 }, result: '你挂上了他们的牌子。收入稳定了，但你再也不是自己的老板。', type: 'normal' }
        ]
    },
    {
        id: 'chain_competitor_2', phase: 'mid', originFilter: null,
        title: '价格战升级（连锁2/3）',
        desc: '大品牌开始玩阴的——在你店门口发传单，用喇叭喊"隔壁的槟榔添加剂超标"。你的生意跌到了谷底。',
        chain: 'competitor_chain', chainStep: 2, chainLen: 3,
        choices: [
            { text: '收集证据，起诉不正当竞争', effects: { money: -15, network: 10 }, result: '官司打了半年。虽然费钱费力，但你赢了——大品牌被罚款，你的声誉反而上去了。', type: 'normal' },
            { text: '以其人之道还治其人之身', effects: { money: -5, guilt: 15, network: 3 }, result: '你找人去他们店假装食物中毒。效果不错，但你晚上更睡不着了。', type: 'normal' },
            { text: '找行业协会调解', effects: {}, result: '', type: 'blind', blind: [
                { effects: { network: 8, money: 3 }, result: '调解成功，双方划定经营区域。井水不犯河水。', weight: 50 },
                { effects: { money: -8, network: -3 }, result: '调解失败。对方根本不把行业协会放在眼里。', weight: 50 }
            ] }
        ]
    },
    {
        id: 'chain_competitor_3', phase: 'mid', originFilter: null,
        title: '大品牌的没落（连锁3/3）',
        desc: '那家槟榔大企业因为食品安全问题上了315晚会。一夜之间股价暴跌，门店纷纷关闭。你曾经的敌人倒了。',
        chain: 'competitor_chain', chainStep: 3, chainLen: 3,
        choices: [
            { text: '趁机收购他们的设备', effects: { money: -10, skill: 15 }, result: '你用很低的价格买下了他们的加工设备。你的产能翻了三倍。', type: 'normal' },
            { text: '接收他们的老顾客', effects: { money: 15, network: 12, guilt: 8 }, result: '你打出"良心槟榔"的旗号。虽然你知道自己的槟榔也不比他们的安全多少。', type: 'normal' },
            { text: '物伤其类，不落井下石', effects: { network: 5, guilt: -8 }, result: '你没有趁机扩张。看着对手的倒下，你想——下一个会不会是我？', type: 'foreshadow', foreshadowId: 'quit_self' }
        ]
    },
    {
        id: 'online_sales', phase: 'mid', originFilter: null,
        title: '电商风口',
        desc: '一个年轻人跟你说："老板，把你的槟榔挂到网上卖啊！短视频带货，我帮你拍。"你看着手机屏幕，一脸茫然。',
        choices: [
            { text: '试试看，投钱做电商', effects: {}, result: '', type: 'probability', probability: [
                { effects: { money: 25, network: 15, skill: 5 }, result: '短视频爆了！"传统手工槟榔"成了网红产品，订单从全国各地涌来。', chance: 45 },
                { effects: { money: -12, skill: 3 }, result: '投了几万块做推广，效果一般。线上没那么好做。', chance: 55 }
            ] },
            { text: '不懂不做，守好实体店', effects: { skill: 3, money: 3 }, result: '你继续守着实体店。虽然生意不如从前，但至少稳定。', type: 'normal' },
            { text: '雇那个年轻人帮你运营', effects: { money: -8, network: 10, skill: 5 }, result: '年轻人帮你开了网店。虽然赚得不多，但多了一条路。', type: 'normal' }
        ]
    },
    {
        id: 'reporter_investigate', phase: 'mid', originFilter: null,
        title: '暗访记者',
        desc: '一个自称"想批发"的年轻人跟你聊了一下午，套出了你的配方和利润。三天后，一篇《一颗槟榔的暴利链条》刷爆了朋友圈。你的照片赫然在列。',
        choices: [
            { text: '接受采访，公开道歉', effects: { guilt: -15, network: 10 }, result: '你在镜头前承认了槟榔的危害。有人说你作秀，但你也收到了一些人的感谢——说看了报道戒了槟榔。', type: 'normal' },
            { text: '雇水军洗白', effects: { money: -15, guilt: 10 }, result: '', type: 'rps', rps: {
                win: { effects: { money: -10, guilt: 15 }, result: '舆论被压下去了。但你知道这只是暂时的。' },
                lose: { effects: { money: -20, guilt: 20, network: -15 }, result: '水军被曝光是你雇的。舆论彻底炸了，你的店被围堵。' },
                tie: { effects: { money: -15, guilt: 10 }, result: '花了钱效果一般。大家该骂还是骂。' }
            } },
            { text: '关门躲风头', effects: { money: -10, guilt: 5 }, result: '你关了店躲了半个月。风头过了重新开业，但生意大不如前。', type: 'normal' }
        ]
    },
    {
        id: 'employee_sick', phase: 'mid', originFilter: null,
        title: '工人之病',
        desc: '你雇的帮工小刘最近消瘦得厉害。他老婆来找你哭诉——口腔癌中期，医生说跟他每天在作坊里嚼槟榔试味有关。"老板，你得管啊！"',
        choices: [
            { text: '出钱给他治病', effects: { money: -20, guilt: -20, network: 15 }, result: '你掏了大半积蓄给小刘治病。街坊邻居都说你有良心。但你知道——你欠他的远不止这些。', type: 'normal' },
            { text: '给一笔遣散费打发', effects: { money: -8, guilt: 15 }, result: '小刘老婆拿着钱哭着走了。你告诉自己"仁至义尽"，但你每天经过小刘空着的工位时都不敢看。', type: 'normal' },
            { text: '"又不是我逼他嚼的"', effects: { guilt: 25, network: -10 }, result: '小刘老婆在门口骂了你三天。整条街的人都听到了。你的生意一落千丈。', type: 'normal' }
        ]
    },
    {
        id: 'tax_inspect', phase: 'mid', originFilter: null,
        title: '税务稽查',
        desc: '税务局突然上门查账。你这些年很多交易都是现金——没开过几张发票。稽查员翻了翻你的账本，摇了摇头。',
        choices: [
            { text: '老实补税交罚款', effects: { money: -18, guilt: -8 }, result: '你补缴了税款和滞纳金。虽然心疼，但至少心里踏实了。', type: 'normal' },
            { text: '找熟人疏通', effects: {}, result: '', type: 'rps', rps: {
                win: { effects: { money: -10, network: -5, guilt: 10 }, result: '找对了人，补了点税意思一下就过了。' },
                lose: { effects: { money: -25, guilt: 15, network: -10 }, result: '关系没走通，还被加了一条"行贿未遂"。罚得更重了。' },
                tie: { effects: { money: -15, guilt: 8 }, result: '折腾了一圈，最后按正常罚款交了。白费了一番力气。' }
            } },
            { text: '把账本藏起来', effects: {}, result: '', type: 'blind', blind: [
                { effects: { money: -5, guilt: 15 }, result: '侥幸过关。但你提心吊胆了整整半年。', weight: 40 },
                { effects: { money: -30, guilt: 20 }, result: '藏账本被发现。抗拒检查罪加一等，被列入税务黑名单。', weight: 60 }
            ] }
        ]
    },
    {
        id: 'addiction_marketing', phase: 'mid', originFilter: null,
        title: '成瘾营销',
        desc: '一个做市场营销的朋友给你出主意：推出"积分卡"——买十包送一包，每月消费满一百元送"VIP金卡"。他说这叫"锁定用户"。',
        choices: [
            { text: '采纳，推出会员体系', effects: { money: 15, guilt: 18, network: 8 }, result: '会员体系效果显著。顾客为了攒积分拼命买，有人一个月嚼了三百包。你的销量翻了一番。', type: 'normal' },
            { text: '觉得太过了，拒绝', effects: { guilt: -10, money: -3 }, result: '朋友说你太死板。但你知道——让人上瘾已经够坏了，不能再推一把。', type: 'normal' },
            { text: '改良方案：积分兑换生活用品', effects: { money: 8, guilt: 8, network: 5 }, result: '你用积分兑换米面粮油而不是槟榔。这样至少没有直接鼓励多吃。', type: 'normal' }
        ]
    },
    {
        id: 'police_raid', phase: 'mid', originFilter: null,
        title: '突击检查',
        desc: '清晨六点，一群执法人员冲进你的作坊。你被按在地上，手被反铐。他们说你非法使用工业石灰、违规添加麻黄草提取物。',
        choices: [
            { text: '认罪伏法', effects: { money: -20, network: -15, guilt: -15 }, result: '你在拘留所待了十五天。出来时作坊已被查封。你想起了那个患口腔癌的老顾客——也许这就是报应。', type: 'normal' },
            { text: '托人找关系', effects: {}, result: '', type: 'rps', rps: {
                win: { effects: { money: -15, network: -5, guilt: 10 }, result: '花了不少钱但总算把你捞出来了。你继续干着老本行，只是更隐蔽了。' },
                lose: { effects: { money: -30, guilt: 15, network: -20 }, result: '关系没走通，反而被举报。罪加一等。' },
                tie: { effects: { money: -20, network: -10 }, result: '折腾了一圈，罚款交了不少但没进去。' }
            } },
            { text: '趁乱翻窗逃跑', effects: {}, result: '', type: 'blind', blind: [
                { effects: { money: -10, guilt: 10, health: -5 }, result: '你翻窗跑了。从此东躲西藏。槟榔生意彻底完了。', weight: 35 },
                { effects: { money: -5, guilt: 8, health: -10 }, result: '跑掉了但摔断了腿。躺在出租屋里连医院都不敢去。', weight: 65 }
            ] }
        ]
    },
    {
        id: 'partner_betray', phase: 'mid', originFilter: null,
        title: '合伙人背叛',
        desc: '你的合伙人卷走了账上的钱跑了。二十万，是你们三个月的利润。他给你留了张字条："对不起，我欠了赌债。槟榔这行太造孽了，你也趁早收手吧。"',
        choices: [
            { text: '报警追查', effects: { money: -5, network: -5 }, result: '警察立案了但人已经跑到了境外。钱追回来的可能性几乎为零。', type: 'normal' },
            { text: '算了，就当花钱买教训', effects: { money: -20, guilt: -5, network: 5 }, result: '你没追。同行们说你傻，但你说"他也是被这行逼的"。你的宽容让人意外。', type: 'normal' },
            { text: '他说的对——趁早收手', effects: { money: -20, guilt: -15 }, result: '你没报警。你想了三天三夜，然后开始处理存货。也许这是上天给你的信号。', type: 'foreshadow', foreshadowId: 'quit_self' }
        ]
    },
    {
        id: 'additive_secret', phase: 'mid', originFilter: ['xiangtan', 'changsha'],
        title: '添加剂商人',
        desc: '一个西装革履的人找到你，打开手提箱——里面是各种瓶瓶罐罐。"这是从东南亚进口的槟榔专用香料。加一滴，顾客就停不下来。"',
        choices: [
            { text: '买一批试试', effects: { money: -5, skill: 10, guilt: 25 }, result: '加了"香料"的槟榔果然大卖。顾客说"你家的槟榔特别有劲"。你不知道里面含有什么成分——也不敢问。', type: 'normal' },
            { text: '拒绝，坚持传统配方', effects: { guilt: -10, money: -3 }, result: '西装男骂了句"不识货"走了。你的槟榔虽然没有那么"有劲"，但你至少知道里面放了什么。', type: 'normal' },
            { text: '偷偷取样去化验', effects: { money: -8, skill: 5, guilt: -15 }, result: '化验结果显示含有麻黄碱——一种被禁止添加的兴奋剂成分。你选择了举报。', type: 'foreshadow', foreshadowId: 'did_good' }
        ]
    },
    {
        id: 'family_illness', phase: 'mid', originFilter: null,
        title: '报应来了',
        desc: '你爹查出了口腔癌。医生说是长期嚼槟榔导致的。你站在病房门口，手里还攥着今天要发给客户的槟榔样品。',
        choices: [
            { text: '销毁所有产品，从此不碰槟榔', effects: { money: -30, skill: -10, guilt: -30 }, result: '你把仓库里的槟榔全烧了。火光冲天，邻居以为着火了。你跪在火堆前哭了一整夜。', type: 'foreshadow', foreshadowId: 'quit_self' },
            { text: '给爹治病但生意照做', effects: { money: -15, guilt: 20, health: -5 }, result: '你出钱给爹治病，但槟榔照卖。你告诉自己"这是两码事"。但每次去医院，你都不敢看爹的眼睛。', type: 'normal' },
            { text: '"爹嚼了几十年，跟我卖的没关系"', effects: { guilt: 30, health: -8 }, result: '你拒绝承认这之间有联系。但你每晚都在噩梦中惊醒——梦里你爹的嘴里全是血。', type: 'normal' }
        ]
    },
    {
        id: 'expand_factory', phase: 'mid', originFilter: null,
        title: '扩张时机',
        desc: '你的生意越做越大。有人建议你贷款建厂，从手工作坊升级到流水线生产。"要做就做大的，做成品牌！"银行也愿意贷款给你。',
        choices: [
            { text: '贷款建厂，做大做强', effects: { money: 20, skill: 10, guilt: 15, health: -3 }, result: '新工厂开业那天你请了舞狮队。流水线上槟榔一包包地出来，你站在车间里觉得自己像个成功人士。', type: 'normal' },
            { text: '稳扎稳打，不扩张', effects: { skill: 5, money: 3 }, result: '你没有扩张。虽然赚得少但风险也小。你不确定槟榔这行还能做多久。', type: 'normal' },
            { text: '转型做食品加工，不做槟榔了', effects: { money: -10, guilt: -20, skill: 5 }, result: '你把贷款用来开了一家果脯加工厂。虽然起步艰难，但你不用再昧着良心赚钱了。', type: 'foreshadow', foreshadowId: 'quit_self' }
        ]
    },
    {
        id: 'celebrity_endorse', phase: 'mid', originFilter: null,
        title: '明星代言',
        desc: '一个三线明星的经纪人找到你——五十万，代言一年。他说："槟榔这行需要洗白，需要明星背书。你们可以把槟榔包装成潮牌、生活方式。"',
        choices: [
            { text: '签下代言合同', effects: { money: 30, network: 20, guilt: 20 }, result: '明星的粉丝疯狂购买你的槟榔。销量暴增，你笑得合不拢嘴——直到一年后那个明星因为吸毒被抓，你的品牌也跟着臭了。', type: 'normal' },
            { text: '太贵了，不请', effects: { money: 5, skill: 3 }, result: '你省下了五十万。虽然没爆红，但你也不用担心明星出事连累你。', type: 'normal' },
            { text: '请本地网红，便宜接地气', effects: { money: 12, network: 10, guilt: 8 }, result: '本地网红拍了几条短视频，效果不错。虽然没全国爆红，但在本地打开了市场。', type: 'normal' }
        ]
    },
    {
        id: 'child_question', phase: 'mid', originFilter: null,
        title: '孩子的质问',
        desc: '你儿子放学回来，把书包往地上一摔："爸！同学说你卖的是害人的东西！老师说槟榔致癌！你在骗人吗？"',
        choices: [
            { text: '无言以对，陷入沉默', effects: { guilt: 10, health: -3 }, result: '你不知道怎么回答。你摸了摸儿子的头，什么都没说。那天晚上你一个人在阳台嚼了一整夜的槟榔。', type: 'foreshadow', foreshadowId: 'quit_self' },
            { text: '"爸爸做的是正经生意"', effects: { guilt: 15, network: 3 }, result: '你对儿子说了谎。但你知道——等儿子长大，他会明白一切的。到时候他会怎么看你？', type: 'normal' },
            { text: '跟儿子坦白一切', effects: { guilt: -20, network: -5 }, result: '你告诉儿子槟榔确实有害，你确实在卖害人的东西。儿子哭了。但你也哭了——这是你第一次对人说真话。', type: 'foreshadow', foreshadowId: 'did_good' }
        ]
    },
    {
        id: 'doctor_warning', phase: 'mid', originFilter: null,
        title: '医生的怒吼',
        desc: '你去体检，口腔科医生看了你的嘴巴后脸色大变："你嚼槟榔多久了？你知道口腔黏膜下纤维性变是什么吗？你这是癌前病变！你再嚼下去，我下次见你就是在手术台上！"',
        choices: [
            { text: '立刻戒槟榔', effects: { health: 20, guilt: -10 }, result: '你把口袋里的槟榔全扔进了垃圾桶。戒断反应很痛苦——失眠、焦虑、脾气暴躁。但三个月后你的口腔黏膜开始恢复了。', type: 'normal' },
            { text: '减少量但戒不掉', effects: { health: 5, guilt: 5 }, result: '你从每天五十颗减到二十颗。医生说不够，但你说"已经进步了"。你在自欺欺人。', type: 'normal' },
            { text: '"医生你管太多了"', effects: { health: -15, guilt: 10 }, result: '你换了个医生，换了个医院。你不喜欢听真话。但你的口腔不会因为你换了医生就变好。', type: 'normal' }
        ]
    },
    {
        id: 'fake_organic', phase: 'mid', originFilter: null,
        title: '有机认证的诱惑',
        desc: '你发现只要花两万块就能从某个中介手里买到一个"有机槟榔"的认证。虽然你的槟榔跟有机八竿子打不着，但这个标能让价格翻倍。',
        choices: [
            { text: '买！消费者又吃不出来', effects: { money: 20, guilt: 20, network: 5 }, result: '挂上"有机"标签后你的槟榔进了高端超市。白领们一边喝有机果汁一边嚼你的"有机槟榔"，没人怀疑。', type: 'normal' },
            { text: '不买，诚信经营', effects: { guilt: -10, money: -3 }, result: '你拒绝了这个诱惑。虽然赚钱慢，但你的槟榔是什么样就是什么样。', type: 'normal' },
            { text: '举报这个中介', effects: { guilt: -15, network: 10 }, result: '你向工商举报了卖假认证的中介。工商端掉了这条灰色产业链。同行们不知道是你干的——你也不想让人知道。', type: 'foreshadow', foreshadowId: 'did_good' }
        ]
    },
    {
        id: 'poison_suspect', phase: 'mid', originFilter: null,
        title: '投毒风波',
        desc: '突然传出消息——有人在某品牌槟榔里投毒，已经死了两个人。整个槟榔市场陷入恐慌。虽然不是你的品牌，但所有槟榔店都受到了影响。',
        choices: [
            { text: '主动送检，公开检测报告', effects: { money: -8, network: 15, guilt: -5 }, result: '你的槟榔通过了检测。公开透明的态度让顾客信任你，你的店反而成了这条街上唯一排队的。', type: 'normal' },
            { text: '趁乱收购别家的库存', effects: { money: 15, guilt: 15 }, result: '别人恐慌你贪婪。你低价收购了大量槟榔，等风头过了再高价卖出。赚了，但你也知道——发灾难财的人不会有好下场。', type: 'normal' },
            { text: '暂时关门，等风头过去', effects: { money: -5 }, result: '你关了半个月。风头过后重新开业，生意恢复得差不多了。', type: 'normal' }
        ]
    },
    {
        id: 'friend_dies', phase: 'mid', originFilter: null,
        title: '同行之死',
        desc: '你的老伙计——隔壁摊的老王，口腔癌走了。才四十二岁。葬礼上，他老婆哭着说："就是那破槟榔害的！"在场的都是槟榔同行，没一个人敢搭话。',
        choices: [
            { text: '幡然醒悟，金盆洗手', effects: {}, result: '', type: 'quit', quitTitle: '🙏 幡然醒悟', quitDesc: '你把存货全倒进了河里。老王葬礼上那些不敢搭话的同行的脸，一张张在你脑海里闪过。你关了作坊回了老家。后来你在镇上开了间小卖部，卖烟酒糖茶，唯独不卖槟榔。有人问你以前做什么的，你说："做错过一些事，现在不了。"' },
            { text: '兔死狐悲，但生意照做', effects: { money: 5, guilt: 10, health: -3 }, result: '葬礼回来你多嚼了两颗槟榔压惊。老王的摊位很快被人盘下来，生意照旧。', type: 'normal' },
            { text: '"他嚼太多了，我控制量就没事"', effects: { guilt: 15, health: -5 }, result: '你用这种自欺欺人的话安慰自己。但你每天嚼的量比老王还多。', type: 'normal' }
        ]
    },
    {
        id: 'quit_offer_1', phase: 'mid', originFilter: null,
        title: '老同学的邀请',
        desc: '一个多年未见的老同学找到你。他现在在广东做农产品加工——荔枝干、龙眼干，正经生意。"你手艺这么好，干嘛非做槟榔？来跟我干吧，赚得少点但晚上睡得着。"',
        choices: [
            { text: '接受邀请，金盆洗手', effects: {}, result: '', type: 'quit', quitTitle: '🙏 金盆洗手', quitDesc: '你烧掉了所有槟榔配方，坐上了南下的火车。在广东的工厂里你从零开始学做果干加工。虽然收入只有以前的一半，但你终于不用在梦里被那些溃烂的嘴巴追着跑了。十年后你成了工厂的技术主管，娶了当地姑娘，有了孩子。有人问起你的过去，你沉默片刻，说："我以前差点成了杀人犯。"' },
            { text: '"槟榔来钱快，我放不下"', effects: { money: 5, guilt: 10 }, result: '老同学叹了口气走了。你继续守着槟榔摊。但每次想起他说的话，心里总有个声音：你本来可以走的。', type: 'normal' },
            { text: '"等我赚够了就走"', effects: { money: 8, guilt: 5 }, result: '你说服了自己再干两年。但你不知道——两年后还有没有机会。', type: 'normal' }
        ]
    },
    {
        id: 'quit_offer_2', phase: 'late', originFilter: null,
        title: '乡村振兴的机会',
        desc: '你的堂兄从老家来找你，说村里在搞乡村振兴，政府扶持特色农业。"你在外面做那个害人的东西，村里人都知道了。回来吧，种脐橙一样能赚钱。"',
        choices: [
            { text: '回去种橙子，重新做人', effects: {}, result: '', type: 'quit', quitTitle: '🌳 回归田园', quitDesc: '你回到了阔别多年的老家。山上的槟榔树被你亲手砍掉，种上了脐橙苗。头两年很苦但你咬牙挺过来了。第三年满山的橙子挂果，金灿灿的一片。你在村里开了农家乐，城里人来采摘都说甜。有人认出你以前是做槟榔的，你笑笑："那都是上辈子的事了。"' },
            { text: '"我没脸回去"', effects: { money: 3, guilt: 8, health: -3 }, result: '你低下了头。堂兄默默离开。你继续守着槟榔摊——但你离老家越来越远了。', type: 'normal' },
            { text: '"种橙子哪有槟榔来钱快"', effects: { money: 5, guilt: 15, health: -3 }, result: '你嗤之以鼻。堂兄摇头："你早晚会后悔的。"', type: 'normal' }
        ]
    },
    {
        id: 'last_chance', phase: 'late', originFilter: null,
        title: '最后的救赎',
        desc: '你的身体已经发出严重警告：口腔溃烂、牙龈萎缩、吞咽困难。医生下了最后通牒——再不戒槟榔，最多两年。你坐在空荡荡的店里，看着满墙的槟榔包装袋，忽然觉得它们像一张张催命符。',
        choices: [
            { text: '烧掉所有存货，彻底转行', effects: {}, result: '', type: 'quit', quitTitle: '🔥 浴火重生', quitDesc: '一把火烧掉了半生心血。火光映着你的脸，你泪流满面，但心里却前所未有的轻松。你回老家种地去了——种的是有机蔬菜，不是槟榔。有人问起你以前做什么的，你说："我以前干过一件很蠢的事，现在不干了。"' },
            { text: '"反正也活不长了，就这样吧"', effects: { health: -30, guilt: 25 }, result: '你放弃了挣扎。每天机械地做槟榔、卖槟榔、嚼槟榔。你不知道自己是在等死，还是在等什么。', type: 'normal' },
            { text: '把店传给徒弟，自己躲起来', effects: { skill: -10, money: 15, guilt: 10, health: -5 }, result: '你拿了笔转让费躲到了乡下。徒弟继续经营着你创下的"品牌"，继续害着下一批人。', type: 'normal' }
        ]
    },
    // ==================== 后期事件 (45-55岁) ~28个 ====================
    {
        id: 'final_ban_rumor', phase: 'late', originFilter: null,
        title: '山雨欲来',
        desc: '新闻里开始密集报道槟榔危害。人大代表提案全面禁止槟榔产业。行业协会紧急开会，所有人脸色铁青。有人说"要变天了"。',
        choices: [
            { text: '开始偷偷转移资产', effects: { money: 10, guilt: 5 }, result: '你把一部分钱转到了老婆名下，把仓库的货也分散到几个地方。狡兔三窟。', type: 'normal' },
            { text: '加入行业协会，参与游说', effects: { money: -10, network: 15, guilt: 15 }, result: '你们凑钱去省里"做工作"。你看到了这个行业最后的挣扎——像一个癌症晚期病人。', type: 'normal' },
            { text: '提前金盆洗手', effects: {}, result: '', type: 'quit', quitTitle: '⏰ 及时抽身', quitDesc: '你在政策落地前一年卖掉了所有资产。你用这笔钱在海南开了家民宿，面朝大海。偶尔有客人认出你——"你是不是以前做槟榔的？"你说："那都是上辈子的事了。来，尝尝我们自己种的椰子。"' }
        ]
    },
    {
        id: 'last_customer', phase: 'late', originFilter: null,
        title: '最后一个顾客',
        desc: '一个满脸皱纹的老人颤颤巍巍走到你店门口。他嘴里已经没有几颗牙了——都被槟榔磨掉了。但他还是要买。"嚼了一辈子，戒不掉了。"',
        choices: [
            { text: '卖给他，但劝他少嚼', effects: { money: 3, guilt: 8 }, result: '老人笑了："少嚼？我嚼了五十年了，你说少嚼？"你看着他蹒跚的背影，心想自己老了会不会也这样。', type: 'normal' },
            { text: '"大爷，别嚼了"', effects: { money: -3, guilt: -10 }, result: '你破天荒地拒绝了一个顾客。老人骂骂咧咧走了，但走了几步又回来："你说得对，是该戒了。"他把手里的槟榔扔进了垃圾桶。', type: 'normal' },
            { text: '送他一包，不要钱', effects: { money: -3, guilt: 5 }, result: '你说"最后一包，送你的"。老人千恩万谢。你觉得这是他最后一次买——不是因为他要戒，是因为他活不长了。', type: 'normal' }
        ]
    },
    {
        id: 'nightmare', phase: 'late', originFilter: null,
        title: '午夜梦回',
        desc: '你做了一个梦——所有因为你槟榔患上口腔癌的人都来找你。他们排着队，一个个张不开嘴，用笔在纸上写：为什么？你为什么明知道会害人还要卖？',
        choices: [
            { text: '醒来后去寺庙烧香', effects: { guilt: -5, health: 3 }, result: '你在佛前跪了一上午。你捐了一大笔香火钱。但你知道——佛祖不会因为你捐了钱就原谅你。', type: 'normal' },
            { text: '醒来后多嚼了两颗压惊', effects: { health: -5, guilt: 10 }, result: '你用槟榔来麻痹对槟榔的恐惧。这本身就是一个残酷的讽刺。', type: 'normal' },
            { text: '醒来后给所有老顾客发了条信息', effects: { guilt: -15, network: 10 }, result: '你群发了一条信息："对不起，槟榔真的有害。如果还来得及，请别再嚼了。"有人回复"神经病"，也有人回复"谢谢你"。', type: 'foreshadow', foreshadowId: 'did_good' }
        ]
    },
    {
        id: 'media_expose_final', phase: 'late', originFilter: null,
        title: '央视曝光',
        desc: '央视做了一期槟榔专题——暗访了多家槟榔作坊，包括你的。镜头里，你正在往卤水里加工业石灰。全国观众都看到了。',
        choices: [
            { text: '上电视公开道歉', effects: { guilt: -20, network: -15, money: -15 }, result: '你在镜头前哭了。你说你后悔，说你害了很多人。有人骂你演戏，但更多的人开始关注槟榔危害。你的道歉推动了一个行业的终结。', type: 'normal' },
            { text: '躲起来不见人', effects: { money: -10, network: -20, guilt: 10 }, result: '你关了手机，拉上窗帘，不敢出门。你在出租屋里躲了整整一个月。等你再出门时，你的店已经被人喷了红漆——"杀人犯"。', type: 'normal' },
            { text: '找律师告电视台', effects: {}, result: '', type: 'blind', blind: [
                { effects: { money: -20, network: -15, guilt: 15 }, result: '官司打输了。你不仅没告倒电视台，反而让更多人知道了你的所作所为。', weight: 70 },
                { effects: { money: -10, guilt: 10 }, result: '庭外和解。电视台删了你的镜头，但网上早就传遍了。', weight: 30 }
            ] }
        ]
    },
    {
        id: 'hospital_bed', phase: 'late', originFilter: null,
        title: '病床上',
        desc: '你躺在了病床上。口腔癌晚期。窗外阳光很好，但你张不开嘴——肿瘤已经堵住了你的喉咙。你只能用笔在纸上写字。',
        choices: [
            { text: '写下"对不起"', effects: { guilt: -25, health: -20 }, result: '你用歪歪扭扭的字写了三个字——"对不起"。你不知道写给谁。写给所有被你害过的人。写给当初那个递给你第一颗槟榔的师傅。写给你自己。', type: 'normal' },
            { text: '写下"报应"', effects: { guilt: -10, health: -15 }, result: '你写下这两个字后闭上了眼睛。家人以为你睡着了——其实你在想，如果当初不嚼那一口，人生会不会不一样。', type: 'normal' },
            { text: '写下遗嘱，捐出所有财产', effects: { money: -50, guilt: -30, network: 10 }, result: '你把所有积蓄捐给了口腔癌研究基金。护士说你是她们见过最奇怪的病人——一个槟榔贩子，捐钱研究怎么治疗槟榔引起的癌症。', type: 'foreshadow', foreshadowId: 'did_good' }
        ]
    },
    {
        id: 'street_shame', phase: 'late', originFilter: null,
        title: '过街老鼠',
        desc: '你走在街上被人认出来了。一个中年妇女冲过来扇了你一耳光——"我老公就是嚼你家的槟榔得癌症死的！"围观的人越来越多。',
        choices: [
            { text: '跪下来道歉', effects: { guilt: -15, network: -10, health: -3 }, result: '你跪在了街上。围观的人有的拍照，有的摇头，有的哭了。那个打你的女人也哭了——她没想到你真的会跪。', type: 'normal' },
            { text: '低头快步离开', effects: { guilt: 10, network: -5 }, result: '你逃走了。但你知道——你逃得了这条街，逃不了自己的良心。', type: 'normal' },
            { text: '"你老公自己愿意嚼的，关我什么事"', effects: { guilt: 25, network: -20 }, result: '这句话激怒了所有人。你被围在中间推搡，最后是警察来了才把你救出来。但从此你再也抬不起头做人。', type: 'normal' }
        ]
    },
    {
        id: 'industry_collapse', phase: 'late', originFilter: null,
        title: '行业末日',
        desc: '国家终于出手了。槟榔被列入一类致癌物，全面禁止生产销售。行业协会宣布解散，所有人都在抛售存货。你站在自己的仓库门口，看着满仓的槟榔——它们现在一文不值。',
        choices: [
            { text: '默默接受，转身离开', effects: { money: -30, guilt: -5 }, result: '你最后看了一眼仓库，头也不回地走了。你用了大半辈子才明白——有些钱不该赚。', type: 'normal' },
            { text: '组织同行上访', effects: { money: -10, network: -10, guilt: 10 }, result: '你们去省里上访，要求"给槟榔产业一条活路"。但没人同情你们——你们给过那些患者活路吗？', type: 'normal' },
            { text: '一把火烧掉一切', effects: {}, result: '', type: 'quit', quitTitle: '🔥 烈火焚业', quitDesc: '你在仓库门口浇上汽油，一根火柴扔了进去。火光冲天，消防车呼啸而来。警察问你为什么放火，你说："烧的不是槟榔，是我的罪。"你被拘留了十五天。出来时一无所有——但你觉得比任何时候都轻松。' }
        ]
    },
    {
        id: 'final_alone', phase: 'late', originFilter: null,
        title: '众叛亲离',
        desc: '你的家人终于受不了了。妻子带着孩子搬走了，亲戚朋友跟你断了来往。你独自坐在空荡荡的屋里，嘴里的槟榔汁吐了一地。',
        choices: [
            { text: '给妻子打电话道歉', effects: { network: 5, guilt: -10 }, result: '电话那头沉默了很长时间。她说："我等你这句话等了十年。但已经晚了。"挂断后你嚎啕大哭。', type: 'normal' },
            { text: '继续嚼槟榔麻痹自己', effects: { health: -15, guilt: 15 }, result: '你用槟榔来对抗孤独。越孤独越嚼，越嚼越孤独。你成了一个恶性循环的人。', type: 'normal' },
            { text: '去戒毒中心求助', effects: { health: 10, money: -10, guilt: -15 }, result: '你在戒断中心待了两个月。戒槟榔比戒烟难一百倍——但你挺过来了。出来后你想去找家人，但不知道他们还愿不愿意见你。', type: 'normal' }
        ]
    },
    {
        id: 'chain_cancer_1', phase: 'late', originFilter: null,
        title: '晚期（连锁1/3）',
        desc: '你被确诊为口腔癌晚期。医生说已经扩散到淋巴了，手术意义不大。建议你做化疗，但五年生存率不到20%。',
        chain: 'cancer_chain', chainStep: 1, chainLen: 3,
        choices: [
            { text: '积极治疗', effects: { money: -25, health: -10 }, result: '化疗让你吐得昏天黑地，头发掉光，体重骤降。但你在坚持——你还有很多话想说。', type: 'normal' },
            { text: '放弃治疗，回家等死', effects: { health: -30, guilt: 20 }, result: '你签了放弃治疗同意书。医生叹了口气没说话——他见过太多这样的病人了。', type: 'normal' },
            { text: '去最好的肿瘤医院再查一次', effects: { money: -20, health: 5 }, result: '北京的专家看完后摇了摇头——和县医院的诊断一样。但至少你尽力了。', type: 'normal' }
        ]
    },
    {
        id: 'chain_cancer_2', phase: 'late', originFilter: null,
        title: '病危通知（连锁2/3）',
        desc: '你被下了病危通知。家人都来了，站在床边。你想说话但嘴巴已经张不开了——肿瘤把整个口腔堵死了。',
        chain: 'cancer_chain', chainStep: 2, chainLen: 3,
        choices: [
            { text: '用笔写下遗言', effects: { guilt: -20 }, result: '你颤抖着手写道："别嚼槟榔。"三个字，你用了整整五分钟。这是你用命换来的教训。', type: 'normal' },
            { text: '用手指了指窗外的槟榔树', effects: { guilt: 15, health: -10 }, result: '家人不懂你的意思。你是想说"砍了它"？还是想说"继续种"？没人知道。', type: 'normal' },
            { text: '握着家人的手，流泪', effects: { guilt: -10 }, result: '你什么都说不出来，但眼泪说明了一切——你后悔了。', type: 'normal' }
        ]
    },
    {
        id: 'chain_cancer_3', phase: 'late', originFilter: null,
        title: '最后一颗槟榔（连锁3/3）',
        desc: '临终关怀病房里，你已说不出话。护士问你要什么，你颤抖着手指向床头柜——那里还有半包没吃完的槟榔。',
        chain: 'cancer_chain', chainStep: 3, chainLen: 3,
        choices: [
            { text: '用最后的力气把槟榔扔进垃圾桶', effects: { guilt: -30, health: -20 }, result: '你拼尽最后一丝力气，把槟榔扔进了垃圾桶。护士给你竖了个大拇指。你闭上眼睛，嘴角似乎有了一丝微笑。', type: 'normal' },
            { text: '塞进嘴里，嚼了最后一口', effects: { guilt: 30, health: -30 }, result: '你用尽最后的力气嚼了一颗槟榔。血水和槟榔汁从嘴角流下来。监护仪发出了刺耳的警报——', type: 'normal' },
            { text: '让护士拿去扔了', effects: { guilt: -15, health: -10 }, result: '你示意护士拿走它。护士照做了。你看着槟榔被扔进垃圾桶，长长地呼出了最后一口气。', type: 'normal' }
        ]
    },
    // ===== 金盆洗手额外机会 =====
    {
        id: 'quit_offer_3', phase: 'late', originFilter: null,
        title: '陌生人的善意',
        desc: '一个年轻人走进你的店。他掏出一张照片——上面是一个没了下巴的老人。"这是我爸。嚼了三十年槟榔，去年走的。"他把照片放在柜台上，看着你："收手吧。趁还来得及。"',
        choices: [
            { text: '关店，从此不卖槟榔', effects: {}, result: '', type: 'quit', quitTitle: '🌟 被唤醒的良心', quitDesc: '你把那张照片贴在了店门上，然后锁了门，再也没回来。后来你去了云南，在一个小镇上教孩子们种咖啡。偶尔有游客问起你的过去，你拿出那张照片说："这是一个陌生人的爸爸。他救了我。"' },
            { text: '"谢谢你，但我没办法"', effects: { guilt: 10, health: -3 }, result: '年轻人失望地走了。他把照片留在了柜台上。你收了起来——不知道为什么，你一直没扔。', type: 'normal' },
            { text: '给他一笔钱表示歉意', effects: { money: -10, guilt: -8 }, result: '年轻人没收钱。"我不是来要钱的。我是来救你的。"他说完转身走了。你看着他的背影，很久没动。', type: 'normal' }
        ]
    },
    // ===== 特殊出身后期事件 =====
    {
        id: 'xiangtan_late_legacy', phase: 'late', originFilter: ['xiangtan'],
        title: '师傅的遗言',
        desc: '师傅快不行了。他躺在病床上，嘴里插着管子——口腔癌晚期。他示意你过去，用笔在纸上写："别做了。我这一辈子害了太多人。你是最后一个徒弟，别走我的路。"',
        choices: [
            { text: '在师傅面前发誓不再做槟榔', effects: { guilt: -25, skill: -5 }, result: '你当着师傅的面烧了祖传配方。师傅闭上了眼睛——他走得很安详。', type: 'quit', quitTitle: '🕯️ 师傅的遗愿', quitDesc: '你烧掉了三代祖传的配方。师兄弟们说你疯了，但你知道——这是师傅用命换来的醒悟。后来你在湘潭开了家米粉店，生意红火。有人问你怎么不做槟榔了，你说："我师傅临终前说了一句话——有些东西不该传下去。"' },
            { text: '答应师傅但没做到', effects: { guilt: 15, health: -5 }, result: '你答应了师傅，但师傅走后你还是继续做。你告诉自己"等赚够了就收手"。但你知道——你骗了师傅，也骗了自己。', type: 'normal' },
            { text: '"师傅你放心，我会改良配方"', effects: { guilt: 10, skill: 5 }, result: '你没答应不做，但答应改良。师傅失望地闭上了眼睛。你后来确实改良了配方——但你心里清楚，改良过的槟榔一样致癌。', type: 'normal' }
        ]
    },
    {
        id: 'changsha_late_market', phase: 'late', originFilter: ['changsha'],
        title: '夜市拆迁',
        desc: '政府要拆这条夜市了。你在这里摆了二十年的摊，这里有你所有的故事。拆迁办给了两个选择：拿补偿金走人，或者搬到更偏的新市场。',
        choices: [
            { text: '拿补偿金，趁机转行', effects: { money: 15, guilt: -10 }, result: '你拿了拆迁款，没有去新市场。你在小区门口开了家便利店——卖零食饮料，不卖槟榔。街坊邻居都说你变好了。', type: 'quit', quitTitle: '🏪 新生', quitDesc: '拆迁款加上积蓄，你在小区门口开了家便利店。货架上摆满了零食饮料，唯独没有槟榔。有老顾客来找，你说："不卖了。嚼那个不好。"后来你的便利店成了社区里的"良心店"，街坊都说你变了一个人。' },
            { text: '搬到新市场继续干', effects: { money: 5, guilt: 5 }, result: '你搬到了更偏远的新市场。老顾客流失了大半，但你还想再干几年。', type: 'normal' },
            { text: '拿补偿金扩大规模', effects: { money: 20, guilt: 15 }, result: '你用拆迁款在新市场盘下了三个摊位。你的槟榔帝国反而更大了。但你也离"收手"越来越远。', type: 'normal' }
        ]
    },
    {
        id: 'yiyang_late_land', phase: 'late', originFilter: ['yiyang'],
        title: '土地流转',
        desc: '村里的槟榔地要被征收了。政府要建工业园。补偿款不少，但你家的槟榔树要被全部砍掉。你爹站在田埂上，老泪纵横。',
        choices: [
            { text: '拿补偿款转种别的', effects: { money: 15, guilt: -15 }, result: '你拿着补偿款种上了猕猴桃。三年后猕猴桃丰收，你说"早知道就不种槟榔了"。', type: 'quit', quitTitle: '🌿 改种希望', quitDesc: '槟榔树全被砍了。你拿着补偿款引进了猕猴桃品种。头两年村里人笑你傻——猕猴桃哪有槟榔赚钱。第三年猕猴桃挂果，一亩赚了三万。你成了全县的"转型明星"，电视台来采访你，你说："种槟榔是害人，种水果是养人。"' },
            { text: '拿了补偿金去城里做槟榔生意', effects: { money: 10, guilt: 10 }, result: '你用补偿款在城里开了家槟榔加工厂。你从种槟榔变成了做槟榔——越陷越深。', type: 'normal' },
            { text: '抗拒征收，守住槟榔园', effects: {}, result: '', type: 'blind', blind: [
                { effects: { money: 5, guilt: 5 }, result: '你成了钉子户，最后多拿了些补偿款。但槟榔园还是被推了。', weight: 60 },
                { effects: { money: -10, network: -10 }, result: '强拆时你被带走拘留了。出来后槟榔园已经成了工地。', weight: 40 }
            ] }
        ]
    },
    {
        id: 'wailai_late_return', phase: 'late', originFilter: ['wailai'],
        title: '衣锦还乡',
        desc: '你赚了不少钱，决定回老家看看。老家还是那个样子——穷。亲戚们听说你在外面发财了，都围上来问做什么生意。',
        choices: [
            { text: '说实话，然后劝大家别做槟榔', effects: { guilt: -20, network: -5 }, result: '你告诉大家你做槟榔赚了钱，但你也说了槟榔的危害。你说"别学我，这是害人的买卖"。亲戚们半信半疑。', type: 'foreshadow', foreshadowId: 'did_good' },
            { text: '吹嘘槟榔行业多赚钱', effects: { guilt: 20, network: 10 }, result: '你说的天花乱坠。第二年老家多了三家槟榔作坊——都是你亲戚开的。你"带动"了家乡经济，也"带动"了家乡的口腔癌发病率。', type: 'normal' },
            { text: '不说槟榔，只说做食品生意', effects: { guilt: 5, network: 5 }, result: '你含糊其辞，没有鼓励也没有阻止。但你心里清楚——你越不说，越有人好奇。', type: 'normal' }
        ]
    },
    // ===== 中后期通用事件 =====
    {
        id: 'midlife_crisis', phase: 'mid', originFilter: null,
        title: '中年危机',
        desc: '你今年三十五了。半夜醒来照镜子——牙齿黄黑、嘴角溃烂、两颊凹陷。你看起来像五十岁。你突然想：我这辈子到底在干什么？',
        choices: [
            { text: '开始思考转行', effects: { guilt: -10, skill: -3 }, result: '你开始留意别的行业。虽然暂时还在做槟榔，但你在为将来做准备了。', type: 'foreshadow', foreshadowId: 'quit_self' },
            { text: '买辆车奖励自己', effects: { money: -15, guilt: 8 }, result: '你提了辆新车。坐在车里嚼着槟榔，你觉得人生还不错。直到你发现方向盘上全是槟榔汁。', type: 'normal' },
            { text: '去健身房锻炼', effects: { health: 8, money: -5 }, result: '教练看了你的体检报告差点晕过去。你开始健身，但你戒不掉槟榔——健身和嚼槟榔，这搭配太奇怪了。', type: 'normal' }
        ]
    },
    {
        id: 'religious_awakening', phase: 'mid', originFilter: null,
        title: '佛堂忏悔',
        desc: '你被朋友拉去参加了一个禅修班。禅师说："众生皆苦，莫造恶业。"你忽然觉得每一句话都是在说你。',
        choices: [
            { text: '向禅师坦白一切', effects: { guilt: -15, health: 5 }, result: '禅师听完沉默了很久，说："回头是岸。现在还来得及。"你哭了——这是你成年后第一次哭。', type: 'foreshadow', foreshadowId: 'quit_self' },
            { text: '觉得尴尬，中途离场', effects: { guilt: 5 }, result: '你提前走了。朋友问你为什么，你说"不习惯"。其实是你不敢面对自己。', type: 'normal' },
            { text: '捐了一大笔香火钱求心安', effects: { money: -15, guilt: -5 }, result: '你捐了钱，但禅师说："钱买不来心安。"你假装没听见。', type: 'normal' }
        ]
    },
    {
        id: 'old_age_alone', phase: 'late', originFilter: null,
        title: '老无所依',
        desc: '你老了。牙齿几乎掉光了——不是老掉的，是槟榔腐蚀掉的。你戴着假牙，说话漏风。儿女很少来看你——他们说你的槟榔味让他们恶心。',
        choices: [
            { text: '写回忆录警醒后人', effects: { guilt: -15 }, result: '你开始写一本叫《槟榔江湖》的书。第一章的标题是——"如果重来一次，我绝不会碰那颗槟榔。"', type: 'normal' },
            { text: '独自在养老院度过余生', effects: { guilt: 5, health: -5 }, result: '养老院禁止嚼槟榔。你偷偷在房间里嚼，被护工没收了无数次。你成了养老院里最不受欢迎的老人。', type: 'normal' },
            { text: '给所有认识的人发信息道歉', effects: { guilt: -20, network: 5 }, result: '你群发了一条长信息。有人回复"都过去了"，有人没回，有人说"你现在说这些有什么用"。但你至少说了。', type: 'normal' }
        ]
    },
    {
        id: 'regret_letter', phase: 'late', originFilter: null,
        title: '一封信',
        desc: '你收到一封信——来自你二十年前卖给第一颗槟榔的那个少年。信里只有一句话："老板，我还活着。但我没有下巴了。祝你健康。"信封里夹着一张照片。',
        choices: [
            { text: '回信道歉', effects: { guilt: -15, network: 5 }, result: '你写了一封长长的回信。你不知道他能不能收到——但你写了。信的最后你说："对不起。这三个字我欠你二十年了。"', type: 'normal' },
            { text: '不敢打开，烧了信', effects: { guilt: 10 }, result: '你没敢看照片。你把信烧了，但信上的每一个字都印在了你脑子里。你骗不了自己。', type: 'normal' },
            { text: '拿着照片去口腔医院做义工', effects: { guilt: -25, money: -10 }, result: '你开始在医院做义工，给口腔癌患者喂饭、陪聊。每一个患者都让你想起那个少年。你终于开始还债了。', type: 'foreshadow', foreshadowId: 'did_good' }
        ]
    }
];

// ========== 终局事件 ==========
const FINAL_EVENT = {
    id: 'final_ban',
    title: '终局·全面取缔',
    desc: '一纸红头文件——国家卫健委和市场监管总局联合发布公告：槟榔正式被列为一级致癌物，即日起全国禁止生产、销售、广告。整个行业一夜清零。你毕生从事的事业，被定性为"危害公众健康的非法产业"。',
    choices: [
        { text: '默默接受，转身离开', effects: { money: -40, guilt: -5 }, result: '你最后看了一眼招牌，头也不回地走了。你用了大半辈子才明白——有些钱，不该赚。' },
        { text: '冲进去抢几包存货', effects: {}, result: '', type: 'blind', blind: [
            { effects: { money: -20, health: -20, guilt: 20 }, result: '你抢到了几包，躲在角落里拼命嚼。警察发现你时你满嘴是血，像个疯子。你被强制送进了戒断中心。' },
            { effects: { money: -30, guilt: 15 }, result: '你被当场制服。妨害公务，又加了一条罪名。' }
        ] },
        { text: '跪在店门口，放声大哭', effects: { money: -40, guilt: -15, health: 5 }, result: '围观的人有的拍照有的摇头。一个曾经在你店里买过槟榔的年轻人走过来扶起你："老板，你害过我，但你现在也挺可怜的。别哭了，重新开始吧。"' }
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

        // 模式参数：maxTotalChoices=抉择次数上限, yearsPerEvent=每次抉择后推进年数
        const modeConfig = {
            normal:  { maxTotal: 30, yearsPerEvent: 1.5 },
            hardcore:{ maxTotal: 30, yearsPerEvent: 1 },
            fast:    { maxTotal: 20, yearsPerEvent: 2 }
        };
        const cfg = modeConfig[mode];

        this.state = {
            age: 16, year: 1,
            skill: origin.skill, network: origin.network, money: origin.money, health: origin.health, guilt: origin.guilt,
            origin: originKey, seed: seed, rng: new SeededRandom(seed), mode: mode, stage: '入行期',
            history: [], ended: false, endingTitle: '', endingDesc: '',
            totalChoices: 0, maxTotalChoices: cfg.maxTotal,
            yearsPerEvent: cfg.yearsPerEvent,
            finalTriggered: false,
            foreshadow: {}, chainState: {}, pendingChain: null
        };
        this.eventCooldown = {};
        this.choiceUsage = {};
        this.eventHistory = [];
        this.phasePool = this.buildPhasePools();

        document.getElementById('home-screen').classList.remove('active');
        document.getElementById('ending-screen').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');
        document.getElementById('game-seed').textContent = seed;
        this.updateUI();
        this.addLog('system', `📜 ${origin.desc}`);
        this.addLog('system', `🎲 种子：${seed} | ${this.getModeName(mode)}`);
        this.addLog('event', `你以「${origin.name}」的身份踏入了槟榔江湖。那年你${this.state.age}岁，还不知道这条路通向何方。`);
        setTimeout(() => this.triggerEvent(), 600);
    }

    buildPhasePools() {
        const origin = this.state.origin;
        const pools = { early: [], mid: [], late: [] };
        for (const e of ALL_EVENTS) {
            const phase = e.phase || 'mid';
            // 出身过滤
            if (e.originFilter && !e.originFilter.includes(origin)) continue;
            pools[phase].push(e);
        }
        return pools;
    }

    getEventFromPool() {
        const age = this.state.age;
        const phase = getPhase(age);
        const pool = this.phasePool[phase] || this.phasePool['mid'];
        // 过滤已冷却的事件和已触发过的连锁事件
        let available = pool.filter(e => {
            if (this.eventCooldown[e.id]) return false;
            if (e.chain && this.state.chainState[e.chain]?.step >= e.chainStep) return false;
            return true;
        });
        if (available.length === 0) {
            // 重置冷却
            Object.keys(this.eventCooldown).forEach(k => delete this.eventCooldown[k]);
            available = pool.filter(e => !e.chain || !this.state.chainState[e.chain] || this.state.chainState[e.chain].step < e.chainStep);
        }
        if (available.length === 0) available = pool;
        return this.state.rng.pick(available);
    }

    getModeName(m) { return { normal:'普通', hardcore:'硬核', fast:'快进' }[m] || m; }

    skipYears() {
        if (this.state.ended) return;
        this.advanceYears(this.state.yearsPerEvent);
        if (!this.state.ended) this.triggerEvent();
    }

    advanceYears(n) {
        const steps = Math.round(n * 2);
        for (let i = 0; i < steps; i++) {
            this.state.year += 0.5; this.state.age += 0.5;
            // 自然衰减
            if (this.state.age > 30) this.state.health = Math.max(0, this.state.health - this.state.rng.nextInt(0, 2));
            if (this.state.age > 40) this.state.skill = Math.max(0, this.state.skill - this.state.rng.nextInt(0, 1));
            if (this.state.guilt > 50 && this.state.rng.next() < 0.15) this.state.guilt = Math.max(0, this.state.guilt - 1);
            if (this.state.rng.next() < 0.2) this.state.money = Math.max(0, this.state.money - this.state.rng.nextInt(0, 1));
            if (this.state.health < 15 && this.state.rng.next() < 0.2) {
                this.state.health -= 8;
                this.addLog('negative', '⚠️ 你的身体状况急剧恶化……');
            }
            if (this.checkDeath()) break;
        }
        this.state.stage = getStage(this.state.age).name;
        this.updateUI();
    }

    checkDeath() {
        if (this.state.health <= 0) { this.addLog('negative', '💀 你的身体被槟榔彻底摧毁了。'); this.endGame(); return true; }
        if (this.state.skill <= 0) { this.addLog('negative', '📉 你已江郎才尽，再也做不出像样的槟榔。'); this.endGame(); return true; }
        if (this.state.network <= 0) { this.addLog('negative', '🔗 你已众叛亲离，无人愿与你往来。'); this.endGame(); return true; }
        if (this.state.money <= 0) { this.addLog('negative', '💸 你已身无分文，连吃饭的钱都没有了。'); this.endGame(); return true; }
        if (this.state.guilt >= 100) { this.addLog('negative', '😈 罪孽深重，天理不容。'); this.endGame(); return true; }
        if (this.state.age >= 60) { this.addLog('system', '👴 人生迟暮，槟榔江湖再也与你无关。'); this.endGame(); return true; }
        return false;
    }

    triggerEvent() {
        if (this.state.ended) return;
        if (this.checkDeath()) return;

        // 抉择次数用尽，触发终局
        if (!this.state.finalTriggered && this.state.totalChoices >= this.state.maxTotalChoices) {
            this.state.finalTriggered = true;
            this.addLog('system', '⚠️ 命运之轮终于停转。时代的铡刀落了下来——');
            this.addLog('negative', '📜 红头文件：槟榔产业全面取缔。一个害人的时代，终于结束了。');
            this.renderEvent(FINAL_EVENT);
            return;
        }

        // 硬核模式：偶尔跳过事件
        if (this.state.mode === 'hardcore' && this.state.rng.next() < 0.08) {
            this.addLog('system', '⏳ 时光飞逝，世事无常……');
            this.advanceYears(this.state.yearsPerEvent);
            if (this.checkDeath()) return;
            setTimeout(() => this.triggerEvent(), 300);
            return;
        }

        // 金盆洗手事件
        const quitOffers = ALL_EVENTS.filter(e => e.type === 'quit');
        const usedQuits = quitOffers.filter(e => this.eventCooldown[e.id]);
        const totalChoices = this.state.totalChoices;
        const maxTotal = this.state.maxTotalChoices;
        if ((totalChoices >= Math.floor(maxTotal * 0.4) && totalChoices <= Math.floor(maxTotal * 0.45) && usedQuits.length < 1) ||
            (totalChoices >= Math.floor(maxTotal * 0.65) && totalChoices <= Math.floor(maxTotal * 0.7) && usedQuits.length < 2) ||
            (totalChoices >= Math.floor(maxTotal * 0.85) && totalChoices <= Math.floor(maxTotal * 0.9) && usedQuits.length < 3)) {
            const nextQuit = quitOffers.find(e => !this.eventCooldown[e.id] && (e.phase === getPhase(this.state.age) || !e.originFilter || e.originFilter.includes(this.state.origin)));
            if (nextQuit) {
                this.eventCooldown[nextQuit.id] = true;
                this.renderEvent(nextQuit);
                return;
            }
        }

        // 待触发连锁事件
        if (this.state.pendingChain) {
            const chainEvent = ALL_EVENTS.find(e => e.id === this.state.pendingChain);
            if (chainEvent) {
                this.state.pendingChain = null;
                this.renderEvent(chainEvent);
                return;
            }
        }

        // 活跃连锁随机触发
        const activeChains = Object.entries(this.state.chainState).filter(([,v]) => v.step > 0 && v.step < v.len);
        if (activeChains.length > 0 && this.state.rng.next() < 0.5) {
            const [chainId, chainData] = this.state.rng.pick(activeChains);
            const nextId = `${chainId}_${chainData.step + 1}`;
            const nextEvt = ALL_EVENTS.find(e => e.id === nextId);
            if (nextEvt) {
                this.eventCooldown[nextEvt.id] = true;
                this.renderEvent(nextEvt);
                return;
            }
        }

        // 从阶段池中选取事件
        const event = this.getEventFromPool();
        if (event) {
            this.eventCooldown[event.id] = true;
            if (Object.keys(this.eventCooldown).length > 20) {
                const keys = Object.keys(this.eventCooldown);
                for (let i = 0; i < 5; i++) delete this.eventCooldown[keys[i]];
            }
            this.renderEvent(event);
        } else {
            this.addLog('system', '⏳ 时光流逝……');
            this.advanceYears(this.state.yearsPerEvent);
            setTimeout(() => this.triggerEvent(), 300);
        }
    }

    triggerFinalEvent() {
        this.state.finalTriggered = true;
        this.addLog('system', '⚠️ 你已做了' + this.state.totalChoices + '次选择。时代的铡刀终于落下——');
        this.addLog('negative', '📜 红头文件：槟榔产业全面取缔。一个害人的时代，终于结束了。');
        this.renderEvent(FINAL_EVENT);
    }

    renderPixelArt(eventId) {
        const canvas = document.getElementById('pixel-canvas');
        const ctx = canvas.getContext('2d'); const W = 160, H = 120, cW = 8, cH = 8;
        ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f0f23'; ctx.fillRect(0, 0, W, H);
        
        // 尝试加载外部图片（简笔画插图）
        const imgMap = {
            'first_taste': 'images/A_simple_line_drawing_style__l_2026-08-06T15-23-29.png',
            'lime_secret': 'images/Simple_line_drawing__sketch_st_2026-08-06T15-23-50.png',
            'customer_cancer': 'images/Simple_line_drawing__sketch_st_2026-08-06T15-24-10.png'
        };
        
        const imgSrc = imgMap[eventId];
        if (imgSrc) {
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, W, H);
                ctx.fillStyle = '#0f0f23'; ctx.fillRect(0, 0, W, H);
                const scale = Math.min(W / img.width, H / img.height) * 0.9;
                const dw = img.width * scale, dh = img.height * scale;
                const dx = (W - dw) / 2, dy = (H - dh) / 2;
                ctx.drawImage(img, dx, dy, dw, dh);
            };
            img.src = imgSrc;
            return;
        }
        
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
        this.renderPixelArt(event.image || event.id);
        // 隐藏抉择上限和类型标签
        this.addLog('event', `<strong>${event.title}</strong><br>${event.desc}`);
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
            // 概率选项显示概率
            let probText = '';
            if (choice.type === 'probability' && choice.probability) {
                probText = ' <span style="font-size:0.75em;color:#f39c12;">(' + choice.probability.map(p => p.chance + '%').join('/') + ')</span>';
            }
            const effectsText = choice.type === 'probability' ? '' : this.formatEffects(choice.effects || {});
            btn.innerHTML = `${idx + 1}. ${choice.text}${probText}${reqText}${limitText}<span class="choice-effect">${effectsText}</span>`;
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

        // 金盆洗手
        if (choice.type === 'quit') {
            this.addLog('choice', '👉 你终于做出了正确的选择。');
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

        // 处理选项类型
        let effects = {};
        let resultText = '';

        if (choice.type === 'blind') {
            const roll = this.state.rng.nextInt(1, 100);
            let acc = 0;
            for (const b of choice.blind) {
                acc += b.weight;
                if (roll <= acc) { effects = b.effects; resultText = b.result; break; }
            }
        } else if (choice.type === 'probability') {
            const roll = this.state.rng.nextInt(1, 100);
            let acc = 0;
            for (const p of choice.probability) {
                acc += p.chance;
                if (roll <= acc) { effects = p.effects; resultText = p.result; break; }
            }
        } else if (choice.type === 'rps') {
            const player = choiceIdx % 3;
            const sys = this.state.rng.nextInt(0, 2);
            this.addLog('system', '✊ 你出了' + ['石头','剪刀','布'][player] + '，命运出了' + ['石头','剪刀','布'][sys] + '。');
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

        if (resultText) this.addLog('choice', '👉 ' + resultText);
        document.getElementById('choices-area').innerHTML = '';
        this.state.history.push({ age: this.state.age, event: event.title, choice: choice.text });

        // 处理连锁事件
        if (event.chain && event.chainStep) {
            const cs = this.state.chainState[event.chain] || { step: 0, len: event.chainLen || 3 };
            cs.step = event.chainStep;
            cs.len = event.chainLen || 3;
            this.state.chainState[event.chain] = cs;
            if (event.chainStep < cs.len) {
                const nextId = event.chain + '_' + (event.chainStep + 1);
                const nextEvt = ALL_EVENTS.find(e => e.id === nextId);
                if (nextEvt) {
                    this.state.pendingChain = nextId;
                }
            }
        }

        // 终局事件
        if (event.id === 'final_ban') { setTimeout(() => this.endGame(), 500); return; }

        // 抉择次数用尽
        if (!this.state.finalTriggered && this.state.totalChoices >= this.state.maxTotalChoices) {
            this.addLog('negative', '⛔ 命运不再给你选择的机会。');
            this.state.finalTriggered = true;
            setTimeout(() => {
                this.addLog('negative', '📜 红头文件：槟榔产业全面取缔。');
                this.renderEvent(FINAL_EVENT);
            }, 400);
            return;
        }

        this.advanceYears(this.state.yearsPerEvent);
        if (this.checkDeath()) return;
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
        if (s.quitEnding) {
            return { title: s.endingTitle || '🙏 金盆洗手', desc: s.endingDesc || '你逃出了槟榔江湖。' };
        }
        // 即死坏结局
        if (s.health <= 0) return {
            title: '💀 死于槟榔',
            desc: '口腔癌晚期，半边脸烂得不成样子。你用半条命换来的积蓄全扔进了医院。咽气前你含糊不清地说了句什么——护士猜是"后悔"，也可能只是"疼"。槟榔江湖最后一个牺牲品，就是你自己。'
        };
        if (s.skill <= 0) return {
            title: '📉 江郎才尽',
            desc: '你的手艺被时代抛弃了。年轻人用机器代替手工，用工业香精代替祖传配方。你的槟榔再也卖不出去，作坊关了门，学徒全跑了。你蹲在空荡荡的作坊里嚼着最后一颗槟榔——连这颗都做得不好吃了。'
        };
        if (s.network <= 0) return {
            title: '🔗 众叛亲离',
            desc: '你坑了太多人——欠供应商的钱不还，骗顾客的配方不说，连亲戚朋友都被你坑遍了。最后没有人愿意接你的电话。你一个人死在出租屋里，尸体三天后才被发现。房东说"终于能把这个槟榔鬼赶出去了"。'
        };
        if (s.money <= 0) return {
            title: '💸 一贫如洗',
            desc: '槟榔生意做不下去了。你想转行但除了做槟榔什么都不会。积蓄花光后你开始在街上捡瓶子卖。曾经你一天赚的钱比普通人一个月都多，现在你翻垃圾桶找饭吃。最讽刺的是——你翻到的垃圾桶里全是槟榔包装袋。'
        };
        if (s.guilt >= 100) return {
            title: '😈 罪孽滔天',
            desc: '你的一生害了太多人。工业石灰、违禁添加物、向未成年人销售——你什么都干过。罪孽值满的那一刻，你感到一阵寒意。你知道那些因为你失去下巴、失去舌头、失去生命的人，都在另一个世界等你。你不会有好下场的。'
        };
        // 终局结局
        if (s.finalTriggered) {
            if (s.health <= 15) return {
                title: '💀 槟榔陪葬',
                desc: '取缔令下来那天你正在医院做化疗。口腔癌晚期，半边脸已经烂得不成样子。你用半条命换来的积蓄全扔进了医院。咽气前你含糊不清地说了句什么——护士猜是"后悔"，也可能只是"疼"。'
            };
            if (s.guilt >= 50) return {
                title: '🔥 罪有应得',
                desc: '你明知槟榔致癌却从不提醒顾客。你往卤水里加工业石灰，往配方里掺上瘾成分。产业取缔那天你不仅失去了一切，还被查出多项违法。你在铁窗里度过了最后的日子，没有一个人来探视。'
            };
            if (s.money >= 40) return {
                title: '🏃 携款跑路',
                desc: '你在取缔前转移了资产。换了城市，改了名字，做起了别的生意。但每个深夜你都会梦到那些嚼着你的槟榔患上癌症的脸。钱是保住了，但你从此不敢照镜子。你成了一个有钱的逃犯——逃的不是法律，是自己的良心。'
            };
            if (s.guilt >= 30) return {
                title: '🍂 身败名裂',
                desc: '槟榔产业被全面取缔。你的作坊关停，存货被销毁。有人把你过去的"事迹"发到了网上——工业石灰、学生套餐、虚假宣传。你走在街上被人认出来，被人指着鼻子骂"害人精"。你连门都不敢出了。'
            };
            return {
                title: '🫥 一无所有',
                desc: '封条贴上的那一刻你才发现自己什么都没有了。钱没攒下，身体毁了，家人早就被你气走了。你蹲在店门口看着执法人员把槟榔一箱箱搬走。一辈子就干了这一件事，现在这件事被定性为犯罪。你连后悔的力气都没有了。'
            };
        }
        // 年龄到了
        if (s.age >= 60) return {
            title: '👴 寿终正寝',
            desc: '你活到了晚年。但你的晚年并不安宁——口腔的疼痛让你吃不了任何东西，没有牙齿的嘴巴说话漏风。你的孩子不愿意靠近你——他们说你的槟榔味太重了。你在养老院的角落里度过了最后的日子，没人记得你的名字。'
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
        document.getElementById('game-age').textContent = Math.floor(this.state.age);
        document.getElementById('game-year').textContent = Math.floor(this.state.year);
        document.getElementById('game-choices').textContent = this.state.totalChoices;
        document.getElementById('game-max-choices').textContent = '?';
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
