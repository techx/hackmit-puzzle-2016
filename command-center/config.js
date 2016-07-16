config = {}
var crypto = require('crypto');


var getOrDie = function(varName) {
    var variable = process.env[varName];
    if (!variable) {
        throw "You are missing the " + varName + " environment variable.";
    } else {
        return variable;
    }
}

function Puzzle(urlGenerationFunction, verifierFunction) {
    return {
      generateUrl: urlGenerationFunction,
      verifierFunction: verifierFunction
    }
}

config.githubClientId = getOrDie("GITHUB_CLIENT_ID");
config.githubClientSecret = getOrDie("GITHUB_CLIENT_SECRET");
config.publicHostUrl = getOrDie("PUBLIC_HOST_URL");

// Github usernames - feel free to add yourself
config.admins = [ "katexyu",
                  "anishathalye",
                  "kimberli",
                  "vervious",
                  "Detry322",
                  "lzhang124",
                  "ehzhang",
                  "jenniferjzhang",
                  "zareenc",
                  "Fertogo",
                  "mysticuno",
                  "cmnord",
                  "stefren",
                  "zareenc"
                  ];

function checkBobby(answer){
    return function(guess, user) {
        var NOUNS    = ['people','history','way','art','world','information','map','two','family','government','health','system','computer','meat','year','thanks','music','person','reading','method','data','food','understanding','theory','law','bird','literature','problem','software','control','knowledge','power','ability','economics','love','internet','television','science','library','nature','fact','product','idea','temperature','investment','area','society','activity','story','industry','media','thing','oven','community','definition','safety','quality','development','language','management','player','variety','video','week','security','country','exam','movie','organization','equipment','physics','analysis','policy','series','thought','basis','boyfriend','direction','strategy','technology','army','camera','freedom','paper','environment','child','instance','month','truth','marketing','university','writing','article','department','difference','goal','news','audience','fishing','growth','income','marriage','user','combination','failure','meaning','medicine','philosophy','teacher','communication','night','chemistry','disease','disk','energy','nation','road','role','soup','advertising','location','success','addition','apartment','education','math','moment','painting','politics','attention','decision','event','property','shopping','student','wood','competition','distribution','entertainment','office','population','president','unit','category','cigarette','context','introduction','opportunity','performance','driver','flight','length','magazine','newspaper','relationship','teaching','cell','dealer','debate','finding','lake','member','message','phone','scene','appearance','association','concept','customer','death','discussion','housing','inflation','insurance','mood','woman','advice','blood','effort','expression','importance','opinion','payment','reality','responsibility','situation','skill','statement','wealth','application','city','county','depth','estate','foundation','grandmother','heart','perspective','photo','recipe','studio','topic','collection','depression','imagination','passion','percentage','resource','setting','ad','agency','college','connection','criticism','debt','description','memory','patience','secretary','solution','administration','aspect','attitude','director','personality','psychology','recommendation','response','selection','storage','version','alcohol','argument','complaint','contract','emphasis','highway','loss','membership','possession','preparation','steak','union','agreement','cancer','currency','employment','engineering','entry','interaction','limit','mixture','preference','region','republic','seat','tradition','virus','actor','classroom','delivery','device','difficulty','drama','election','engine','football','guidance','hotel','match','owner','priority','protection','suggestion','tension','variation','anxiety','atmosphere','awareness','bread','climate','comparison','confusion','construction','elevator','emotion','employee','employer','guest','height','leadership','mall','manager','operation','recording','respect','sample','transportation','boring','charity','cousin','disaster','editor','efficiency','excitement','extent','feedback','guitar','homework','leader','mom','outcome','permission','presentation','promotion','reflection','refrigerator','resolution','revenue','session','singer','tennis','basket','bonus','cabinet','childhood','church','clothes','coffee','dinner','drawing','hair','hearing','initiative','judgment','lab','measurement','mode','mud','orange','poetry','police','possibility','procedure','queen','ratio','relation','restaurant','satisfaction','sector','signature','significance','song','tooth','town','vehicle','volume','wife','accident','airport','appointment','arrival','assumption','baseball','chapter','committee','conversation','database','enthusiasm','error','explanation','farmer','gate','girl','hall','historian','hospital','injury','instruction','maintenance','manufacturer','meal','perception','pie','poem','presence','proposal','reception','replacement','revolution','river','son','speech','tea','village','warning','winner','worker','writer','assistance','breath','buyer','chest','chocolate','conclusion','contribution','cookie','courage','dad','desk','drawer','establishment','examination','garbage','grocery','honey','impression','improvement','independence','insect','inspection','inspector','king','ladder','menu','penalty','piano','potato','profession','professor','quantity','reaction','requirement','salad','sister','supermarket','tongue','weakness','wedding','affair','ambition','analyst','apple','assignment','assistant','bathroom','bedroom','beer','birthday','celebration','championship','cheek','client','consequence','departure','diamond','dirt','ear','fortune','friendship','funeral','gene','girlfriend','hat','indication','intention','lady','midnight','negotiation','obligation','passenger','pizza','platform','poet','pollution','recognition','reputation','shirt','sir','speaker','stranger','surgery','sympathy','tale','throat','trainer','uncle','youth','time','work','film','water','money','example','while','business','study','game','life','form','air','day','place','number','part','field','fish','back','process','heat','hand','experience','job','book','end','point','type','home','economy','value','body','market','guide','interest','state','radio','course','company','price','size','card','list','mind','trade','line','care','group','risk','word','fat','force','key','light','training','name','school','top','amount','level','order','practice','research','sense','service','piece','web','boss','sport','fun','house','page','term','test','answer','sound','focus','matter','kind','soil','board','oil','picture','access','garden','range','rate','reason','future','site','demand','exercise','image','case','cause','coast','action','age','bad','boat','record','result','section','building','mouse','cash','class','nothing','period','plan','store','tax','side','subject','space','rule','stock','weather','chance','figure','man','model','source','beginning','earth','program','chicken','design','feature','head','material','purpose','question','rock','salt','act','birth','car','dog','object','scale','sun','note','profit','rent','speed','style','war','bank','craft','half','inside','outside','standard','bus','exchange','eye','fire','position','pressure','stress','advantage','benefit','box','frame','issue','step','cycle','face','item','metal','paint','review','room','screen','structure','view','account','ball','discipline','medium','share','balance','bit','black','bottom','choice','gift','impact','machine','shape','tool','wind','address','average','career','culture','morning','pot','sign','table','task','condition','contact','credit','egg','hope','ice','network','north','square','attempt','date','effect','link','post','star','voice','capital','challenge','friend','self','shot','brush','couple','exit','front','function','lack','living','plant','plastic','spot','summer','taste','theme','track','wing','brain','button','click','desire','foot','gas','influence','notice','rain','wall','base','damage','distance','feeling','pair','savings','staff','sugar','target','text','animal','author','budget','discount','file','ground','lesson','minute','officer','phase','reference','register','sky','stage','stick','title','trouble','bowl','bridge','campaign','character','club','edge','evidence','fan','letter','lock','maximum','novel','option','pack','park','plenty','quarter','skin','sort','weight','baby','background','carry','dish','factor','fruit','glass','joint','master','muscle','red','strength','traffic','trip','vegetable','appeal','chart','gear','ideal','kitchen','land','log','mother','net','party','principle','relative','sale','season','signal','spirit','street','tree','wave','belt','bench','commission','copy','drop','minimum','path','progress','project','sea','south','status','stuff','ticket','tour','angle','blue','breakfast','confidence','daughter','degree','doctor','dot','dream','duty','essay','father','fee','finance','hour','juice','luck','milk','mouth','peace','pipe','stable','storm','substance','team','trick','afternoon','bat','beach','blank','catch','chain','consideration','cream','crew','detail','gold','interview','kid','mark','mission','pain','pleasure','score','screw','sex','shop','shower','suit','tone','window','agent','band','bath','block','bone','calendar','candidate','cap','coat','contest','corner','court','cup','district','door','east','finger','garage','guarantee','hole','hook','implement','layer','lecture','lie','manner','meeting','nose','parking','partner','profile','rice','routine','schedule','swimming','telephone','tip','winter','airline','bag','battle','bed','bill','bother','cake','code','curve','designer','dimension','dress','ease','emergency','evening','extension','farm','fight','gap','grade','holiday','horror','horse','host','husband','loan','mistake','mountain','nail','noise','occasion','package','patient','pause','phrase','proof','race','relief','sand','sentence','shoulder','smoke','stomach','string','tourist','towel','vacation','west','wheel','wine','arm','aside','associate','bet','blow','border','branch','breast','brother','buddy','bunch','chip','coach','cross','document','draft','dust','expert','floor','god','golf','habit','iron','judge','knife','landscape','league','mail','mess','native','opening','parent','pattern','pin','pool','pound','request','salary','shame','shelter','shoe','silver','tackle','tank','trust','assist','bake','bar','bell','bike','blame','boy','brick','chair','closet','clue','collar','comment','conference','devil','diet','fear','fuel','glove','jacket','lunch','monitor','mortgage','nurse','pace','panic','peak','plane','reward','row','sandwich','shock','spite','spray','surprise','till','transition','weekend','welcome','yard','alarm','bend','bicycle','bite','blind','bottle','cable','candle','clerk','cloud','concert','counter','flower','grandfather','harm','knee','lawyer','leather','load','mirror','neck','pension','plate','purple','ruin','ship','skirt','slice','snow','specialist','stroke','switch','trash','tune','zone','anger','award','bid','bitter','boot','bug','camp','candy','carpet','cat','champion','channel','clock','comfort','cow','crack','engineer','entrance','fault','grass','guy','hell','highlight','incident','island','joke','jury','leg','lip','mate','motor','nerve','passage','pen','pride','priest','prize','promise','resident','resort','ring','roof','rope','sail','scheme','script','sock','station','toe','tower','truck','witness','a','you','it','can','will','if','one','many','most','other','use','make','good','look','help','go','great','being','few','might','still','public','read','keep','start','give','human','local','general','she','specific','long','play','feel','high','tonight','put','common','set','change','simple','past','big','possible','particular','today','major','personal','current','national','cut','natural','physical','show','try','check','second','call','move','pay','let','increase','single','individual','turn','ask','buy','guard','hold','main','offer','potential','professional','international','travel','cook','alternative','following','special','working','whole','dance','excuse','cold','commercial','low','purchase','deal','primary','worth','fall','necessary','positive','produce','search','present','spend','talk','creative','tell','cost','drive','green','support','glad','remove','return','run','complex','due','effective','middle','regular','reserve','independent','leave','original','reach','rest','serve','watch','beautiful','charge','active','break','negative','safe','stay','visit','visual','affect','cover','report','rise','walk','white','beyond','junior','pick','unique','anything','classic','final','lift','mix','private','stop','teach','western','concern','familiar','fly','official','broad','comfortable','gain','maybe','rich','save','stand','young','heavy','hello','lead','listen','valuable','worry','handle','leading','meet','release','sell','finish','normal','press','ride','secret','spread','spring','tough','wait','brown','deep','display','flow','hit','objective','shoot','touch','cancel','chemical','cry','dump','extreme','push','conflict','eat','fill','formal','jump','kick','opposite','pass','pitch','remote','total','treat','vast','abuse','beat','burn','deposit','print','raise','sleep','somewhere','advance','anywhere','consist','dark','double','draw','equal','fix','hire','internal','join','kill','sensitive','tap','win','attack','claim','constant','drag','drink','guess','minor','pull','raw','soft','solid','wear','weird','wonder','annual','count','dead','doubt','feed','forever','impress','nobody','repeat','round','sing','slide','strip','whereas','wish','combine','command','dig','divide','equivalent','hang','hunt','initial','march','mention','spiritual','survey','tie','adult','brief','crazy','escape','gather','hate','prior','repair','rough','sad','scratch','sick','strike','employ','external','hurt','illegal','laugh','lay','mobile','nasty','ordinary','respond','royal','senior','split','strain','struggle','swim','train','upper','wash','yellow','convert','crash','dependent','fold','funny','grab','hide','miss','permit','quote','recover','resolve','roll','sink','slip','spare','suspect','sweet','swing','twist','upstairs','usual','abroad','brave','calm','concentrate','estimate','grand','male','mine','prompt','quiet','refuse','regret','reveal','rush','shake','shift','shine','steal','suck','surround','anybody','bear','brilliant','dare','dear','delay','drunk','female','hurry','inevitable','invite','kiss','neat','pop','punch','quit','reply','representative','resist','rip','rub','silly','smile','spell','stretch','stupid','tear','temporary','tomorrow','wake','wrap','yesterday']
        var SECRET_ONE   = "eXk@ysE3deEh";
        var SECRET_TWO   = "XsKeihc3eDee";

        var hexOne = crypto.createHash('sha256').update(user + SECRET_ONE).digest('hex');
        var hexTwo = crypto.createHash('sha256').update(user + SECRET_TWO).digest('hex');

        var indexOne = hexOne.split("").reduce(function(a,b){return a + b.charCodeAt(0)},0);
        var indexTwo = hexTwo.split("").reduce(function(a,b){return a + b.charCodeAt(0)},0);

        var answer = NOUNS[indexOne % NOUNS.length] + " " + NOUNS[indexTwo % NOUNS.length];
        return guess.toLowerCase().replace(' ', '') ===
            answer.toLowerCase().replace(' ', '');

    }
}
function check(answer) {
    return function(guess) {
        return guess.toLowerCase().replace(' ', '') ===
            answer.toLowerCase().replace(' ', '');
    };
}


function checkGeo() {
	var possibleLocations = [("42.19702","71.59781"), ("79.71341","85.14546"), ("31.86541","29.46147"), ("21.37220","157.17055"), ("48.98947","2.53996"), ("33.36566","70.03743")];
	return function(guess, username) {
    guess = guess.replace('-', '');
		for (var i = 0; i < possibleLocations.length; i++) {
			if(guess.indexOf(possibleLocations[i][0]) != -1 && guess.indexOf(possibleLocations[i][1]) != -1) {
				return true;
			}
		}
		return false;
	}

}

function checkSports() {
  var base = 'thisisacoolsecret3456345keythatnoonewillguess3409582043svnsfduvla07348tsdfgsdh544927859||||';
  return function(guess, username) {
    var hash = crypto.createHash('sha256');
    hash.update(base + username.toLowerCase());
    return guess.trim().toLowerCase() === hash.digest('hex').substring(0, 10).toLowerCase();
  };
}

function checkRaptor() {
  var raptorsecret = 'secretsecretdogeeeeedoggggeeee19oweijfsspafposdgghackmit4everraptorantscriptwoowowo';
  return function(guess, username) {
    var hash = crypto.createHmac('sha256', raptorsecret);
    hash.update('velociraptor:' + username.toLowerCase());
    return guess.trim().toLowerCase() === hash.digest('hex').substring(0,10).toLowerCase();
  }
};

config.puzzles = [
    /* puzzle 1 - Geohashing */
    Puzzle(function(username){ return "https://time.haxkcd.com/";}, checkGeo()),
    /* puzzle 2 - Bobby */
    Puzzle(function(username){ return "https://xkcde.com/";}, checkBobby()),
    /* puzzle 5 - Raptor */
    Puzzle(function(username){ return "https://raptor.haxkcd.com/play/" + username; }, checkRaptor()),
    /* puzzle 6 - Sports */
    Puzzle(function(username){ return "https://sports.haxkcd.com/" + username; }, checkSports()),
];

config.slackWebhook = "https://hooks.slack.com/services/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";

module.exports = config;
