import { useTranslation } from "react-i18next";
import { ScrollReveal } from "../../components/ui/scroll-reveal";

type TermEntry = {
  label: string;
  body: string | string[];
};

type TermSection = {
  title: string;
  entries: TermEntry[];
};

const TERMS_SECTIONS: TermSection[] = [
  {
    title: "odvody do sociálnej poisťovne",
    entries: [
      {
        label: "Právny základ spracovateľskej činnosti",
        body: "zákon č. 461/2003 Z. z. o sociálnom poistení v znení neskorších predpisov, zákon č. 43/2004 Z. z. o starobnom dôchodkovom sporení o zmene niektorých zákonov v znení neskorších predpisov, zákon č. 650/2004 Z. z. o doplnkovom dôchodkovom sporení a o zmene a doplnení niektorých zákonov v znení neskorších predpisov",
      },
      {
        label: "Kategórie dotknutých osôb",
        body: "zamestnanci spoločnosti, manželia alebo manželky zamestnancov spoločnosti, vyživované deti zamestnancov, rodičia vyživovaných detí zamestnancov, blízke osoby",
      },
      {
        label: "Kategória osobných údajov",
        body: "bežné osobné údaje, osobitná kategória osobných údajov o zdraví zamestnanca (v prípade PN, pracovného úrazu), údaje nevyhnutné na preukázanie splnenia zákonnej povinnosti",
      },
      {
        label: "Lehota na výmaz OÚ",
        body: "10 rokov od vykonania vymedzeného plnenia do sociálnej poisťovne",
      },
      {
        label: "Kategória príjemcovv",
        body: "sociálna poisťovňa, účtovník prevádzkovateľa",
      },
      {
        label: "Označenie tretej krajiny alebo medzinárodnej organizácie",
        body: "prenos do tretej krajiny sa neuskutočňuje",
      },
      {
        label: "Bezpečnostné opatrenia (technické a organizačné)",
        body: "bezpečnostná smernica prevádzkovateľa",
      },
    ],
  },
  {
    title: "odvody do zdravotnej poisťovne",
    entries: [
      {
        label: "Právny základ spracovateľskej činnosti",
        body: "zákon č. 461/2003 Z. z. o sociálnom poistení v znení neskorších predpisov, zákon č. 43/2004 Z. z. o starobnom dôchodkovom sporení o zmene niektorých zákonov v znení neskorších predpisov, zákon č. 650/2004 Z. z. o doplnkovom dôchodkovom sporení a o zmene a doplnení niektorých zákonov v znení neskorších predpisov",
      },
      {
        label: "Kategórie dotknutých osôb",
        body: "zamestnanci spoločnosti, manželia alebo manželky zamestnancov spoločnosti, vyživované deti zamestnancov, rodičia vyživovaných detí zamestnancov, blízke osoby",
      },
      {
        label: "Kategória osobných údajov",
        body: "bežné osobné údaje, osobitná kategória osobných údajov o zdraví zamestnanca (v prípade PN, pracovného úrazu), údaje nevyhnutné na preukázanie splnenia zákonnej povinnosti",
      },
      {
        label: "Lehota na výmaz OÚ",
        body: "10 rokov od vykonania vymedzeného plnenia do sociálnej poisťovne",
      },
      {
        label: "Kategória príjemcovv",
        body: "sociálna poisťovňa, účtovník prevádzkovateľa",
      },
      {
        label: "Označenie tretej krajiny alebo medzinárodnej organizácie",
        body: "prenos do tretej krajiny sa neuskutočňuje",
      },
      {
        label: "Bezpečnostné opatrenia (technické a organizačné)",
        body: "bezpečnostná smernica prevádzkovateľa",
      },
    ],
  },
  {
    title:
      "plnenie povinností prevádzkovateľa ako zamestnávateľa súvisiacich s pracovnoprávnym vzťahom a obdobným vzťahom",
    entries: [
      {
        label: "Právny základ spracovateľskej činnosti",
        body: "zákon č. 461/2003 Z. z. o sociálnom poistení v znení neskorších predpisov, zákon č. 43/2004 Z. z. o starobnom dôchodkovom sporení o zmene niektorých zákonov v znení neskorších predpisov, zákon č. 650/2004 Z. z. o doplnkovom dôchodkovom sporení a o zmene a doplnení niektorých zákonov v znení neskorších predpisov",
      },
      {
        label: "Kategórie dotknutých osôb",
        body: "zamestnanci spoločnosti, manželia alebo manželky zamestnancov spoločnosti, vyživované deti zamestnancov, rodičia vyživovaných detí zamestnancov, blízke osoby",
      },
      {
        label: "Kategória osobných údajov",
        body: "bežné osobné údaje, osobitná kategória osobných údajov o zdraví zamestnanca (v prípade PN, pracovného úrazu), údaje nevyhnutné na preukázanie splnenia zákonnej povinnosti",
      },
      {
        label: "Lehota na výmaz OÚ",
        body: "10 rokov od vykonania vymedzeného plnenia do sociálnej poisťovne",
      },
      {
        label: "Kategória príjemcovv",
        body: "sociálna poisťovňa, účtovník prevádzkovateľa",
      },
      {
        label: "Označenie tretej krajiny alebo medzinárodnej organizácie",
        body: "prenos do tretej krajiny sa neuskutočňuje",
      },
      {
        label: "Bezpečnostné opatrenia (technické a organizačné)",
        body: "bezpečnostná smernica prevádzkovateľa",
      },
    ],
  },
  {
    title:
      "plnenie povinností prevádzkovateľa ako zamestnávateľa na úseku bezpečnosti a ochrany zdravia",
    entries: [
      {
        label: "Právny základ spracovateľskej činnosti",
        body: "zákon č. 461/2003 Z. z. o sociálnom poistení v znení neskorších predpisov, zákon č. 43/2004 Z. z. o starobnom dôchodkovom sporení o zmene niektorých zákonov v znení neskorších predpisov, zákon č. 650/2004 Z. z. o doplnkovom dôchodkovom sporení a o zmene a doplnení niektorých zákonov v znení neskorších predpisov",
      },
      {
        label: "Kategórie dotknutých osôb",
        body: "zamestnanci spoločnosti, manželia alebo manželky zamestnancov spoločnosti, vyživované deti zamestnancov, rodičia vyživovaných detí zamestnancov, blízke osoby",
      },
      {
        label: "Kategória osobných údajov",
        body: "bežné osobné údaje, osobitná kategória osobných údajov o zdraví zamestnanca (v prípade PN, pracovného úrazu), údaje nevyhnutné na preukázanie splnenia zákonnej povinnosti",
      },
      {
        label: "Lehota na výmaz OÚ",
        body: "10 rokov od vykonania vymedzeného plnenia do sociálnej poisťovne",
      },
      {
        label: "Kategória príjemcovv",
        body: "sociálna poisťovňa, účtovník prevádzkovateľa",
      },
      {
        label: "Označenie tretej krajiny alebo medzinárodnej organizácie",
        body: "prenos do tretej krajiny sa neuskutočňuje",
      },
      {
        label: "Bezpečnostné opatrenia (technické a organizačné)",
        body: "bezpečnostná smernica prevádzkovateľa",
      },
    ],
  },
  {
    title: "plnenie daňových povinností prevádzkovateľa",
    entries: [
      {
        label: "Právny základ spracovateľskej činnosti",
        body: "zákon č. 461/2003 Z. z. o sociálnom poistení v znení neskorších predpisov, zákon č. 43/2004 Z. z. o starobnom dôchodkovom sporení o zmene niektorých zákonov v znení neskorších predpisov, zákon č. 650/2004 Z. z. o doplnkovom dôchodkovom sporení a o zmene a doplnení niektorých zákonov v znení neskorších predpisov",
      },
      {
        label: "Kategórie dotknutých osôb",
        body: "zamestnanci spoločnosti, manželia alebo manželky zamestnancov spoločnosti, vyživované deti zamestnancov, rodičia vyživovaných detí zamestnancov, blízke osoby",
      },
      {
        label: "Kategória osobných údajov",
        body: "bežné osobné údaje, osobitná kategória osobných údajov o zdraví zamestnanca (v prípade PN, pracovného úrazu), údaje nevyhnutné na preukázanie splnenia zákonnej povinnosti",
      },
      {
        label: "Lehota na výmaz OÚ",
        body: "10 rokov od vykonania vymedzeného plnenia do sociálnej poisťovne",
      },
      {
        label: "Kategória príjemcovv",
        body: "sociálna poisťovňa, účtovník prevádzkovateľa",
      },
      {
        label: "Označenie tretej krajiny alebo medzinárodnej organizácie",
        body: "prenos do tretej krajiny sa neuskutočňuje",
      },
      {
        label: "Bezpečnostné opatrenia (technické a organizačné)",
        body: "bezpečnostná smernica prevádzkovateľa",
      },
    ],
  },
  {
    title: "mzdová politika zamestnávateľa",
    entries: [
      {
        label: "Právny základ spracovateľskej činnosti",
        body: `zákon č. 311/2001 Z. z. Zákonník práce
zákon č. 580/2004 Z. z. o zdravotnom poistení o zmene a doplnení zákona č. 95/2002 Z. z. o poisťovníctve a o zmene a doplnení niektorých zákonov
zákon č. 461/2003 Z. z. o sociálnom poistení
zákon č. 595/2003 Z. z. o dani z príjmov
zákon č. 43/2004 Z. z. o starobnom dôchodkovom sporení
zákon č. 650/2004 Z. z. o doplnkovom dôchodkovom sporení a o zmene a doplnení niektorých zákonov
zákon č. 5/2004 Z. z. o službách zamestnanosti a o zmene a doplnení niektorých zákonov
zákon č. 462/2003 Z. z. o náhrade príjmu pri dočasnej pracovnej neschopnosti zamestnanca a o zmene a doplnení niektorých zákonov
zákon č. 152/1994 Z. z. o sociálnom fonde a o zmene a doplnení zákona č. 286/1992 Zb. o daniach z príjmov v znení neskorších predpisov`,
      },
      {
        label: "Kategórie dotknutých osôb",
        body: "zamestnanci prevádzkovateľa, vyživované deti zamestnancov, bývalí zamestnanci prevádzkovateľa",
      },
      {
        label: "Kategória osobných údajov",
        body: "bežné osobné údaje, údaje o príjmoch",
      },
      {
        label: "Kategória osobných údajov",
        body: `bežné osobné údaje, napríklad identifikačné údaje, mzda, plat alebo platové pomery a ďalšie finančné náležitosti priznané za výkon pracovnej činnosti, údaje o odpracovanom čase, sumy postihnuté výkonom rozhodnutia nariadeným súdom alebo správnym orgánom, peňažné tresty a pokuty, ako aj náhrady uložené zamestnancovi vykonateľným rozhodnutím príslušných orgánov, údaje o pracovnej neschopnosti, údaje o dôležitých osobných prekážkach v práci, údaje o zmenenej pracovnej schopnosti, deň začiatku výkonu pracovnej činnosti, údaje o vyživovaných deťom v rozsahu meno, priezvisko, rodné číslo, údaje o čerpaní materskej dovolenky a rodičovskej dovolenky, údaje o priznaní dôchodku, o druhu dôchodku, výška príspevku zamestnanca a zamestnávateľa do doplnkovej dôchodkovej poisťovne, platbe členského príspevku odborovej organizácii,
rodinný stav, trvalé bydlisko, prechodné bydlisko, údaje o zamestnávateľovi`,
      },
      {
        label: "Lehota na výmaz OÚ",
        body: "70 rokov po skončení pracovnoprávneho vzťahu",
      },
      {
        label: "Kategória príjemcov",
        body: "Zdravotné poisťovne, sociálna poisťovňa, daňový úrad, DDS, zamestnanci prevádzkovateľa",
      },
      {
        label: "Označenie tretej krajiny alebo medzinárodnej organizácie",
        body: "prenos do tretej krajiny sa neuskutočňuje",
      },
      {
        label: "Bezpečnostné opatrenia (technické a organizačné)",
        body: "bezpečnostná smernica prevádzkovateľa",
      },
    ],
  },
  {
    title:
      "plnenie povinností prevádzkovateľa ako obchodníka s výrobkami obranného priemyslu",
    entries: [
      {
        label: "Právny základ spracovateľskej činnosti",
        body: "čl. 6 ods. 1 písm. c) Nariadenia - plnenie zákonných povinností prevádzkovateľa podľa zákona č. 392/2011 Z. z. o obchodovaní s výrobkami obranného priemyslu a o zmene a doplnení niektorých zákonov v znení neskorších predpisov",
      },
      {
        label: "Kategórie dotknutých osôb",
        body: "zodpovedný zástupca prevádzkovateľa, štatutárne orgány prevádzkovateľa, zahraniční zmluvní partneri prevádzkovateľa vrátane klientov v postavení konečných užívateľov výrobkov obranného priemyslu",
      },
      {
        label: "Kategória osobných údajov",
        body: "bežné osobné údaje, údaje o príjmoch",
      },
      {
        label: "Kategória osobných údajov",
        body: `bežné osobné údaje, napríklad identifikačné údaje, mzda, plat alebo platové pomery a ďalšie finančné náležitosti priznané za výkon pracovnej činnosti, údaje o odpracovanom čase, sumy postihnuté výkonom rozhodnutia nariadeným súdom alebo správnym orgánom, peňažné tresty a pokuty, ako aj náhrady uložené zamestnancovi vykonateľným rozhodnutím príslušných orgánov, údaje o pracovnej neschopnosti, údaje o dôležitých osobných prekážkach v práci, údaje o zmenenej pracovnej schopnosti, deň začiatku výkonu pracovnej činnosti, údaje o vyživovaných deťom v rozsahu meno, priezvisko, rodné číslo, údaje o čerpaní materskej dovolenky a rodičovskej dovolenky, údaje o priznaní dôchodku, o druhu dôchodku, výška príspevku zamestnanca a zamestnávateľa do doplnkovej dôchodkovej poisťovne, platbe členského príspevku odborovej organizácii,
rodinný stav, trvalé bydlisko, prechodné bydlisko, údaje o zamestnávateľovi`,
      },
      {
        label: "Lehota na výmaz OÚ",
        body: "70 rokov po skončení pracovnoprávneho vzťahu",
      },
      {
        label: "Kategória príjemcov",
        body: "Zdravotné poisťovne, sociálna poisťovňa, daňový úrad, DDS, zamestnanci prevádzkovateľa",
      },
      {
        label: "Označenie tretej krajiny alebo medzinárodnej organizácie",
        body: "prenos do tretej krajiny sa neuskutočňuje",
      },
      {
        label: "Bezpečnostné opatrenia (technické a organizačné)",
        body: "bezpečnostná smernica prevádzkovateľa",
      },
    ],
  },
  {
    title:
      "monitorovanie priestorov prevádzkovateľa za účelom ochrany majetku prevádzkovateľa a tretích osôb a za účelom ochrany života a zdravia dotknutých osôb",
    entries: [
      {
        label: "Právny základ spracovateľskej činnosti",
        body: "Oprávnený záujem v zmysle čl. 6 ods. 1 písm. f) Nariadenia. Hlavným oprávneným záujmom je ochrana majetku a bezpečnosti prevádzkovateľa a dotknutých osôb.",
      },
      {
        label: "Kategórie dotknutých osôb",
        body: "zamestnanci a obchodní partneri prevádzkovateľa, ostatné fyzické osoby nachádzajúce sa v priestoroch prevádzkovateľa za rôznym účelom návštevy (záastupcovia dodávateľov, poskytovatelia služieb prevádzkovateľa, kuriéri doručovateľských spoločností a pod.",
      },
      {
        label: "Kategória osobných údajov",
        body: `zamestnanci a obchodní partneri prevádzkovateľa, ostatné fyzické osoby nachádzajúce sa v priestoroch prevádzkovateľa za rôznym účelom návštevy (záastupcovia dodávateľov, poskytovatelia služieb prevádzkovateľa, kuriéri doručovateľských spoločností a pod.`,
      },
      {
        label: "Lehota na výmaz OÚ",
        body: "po uplynutí 14 dní od vyhotovenia kamerového záznamu",
      },
      {
        label: "Kategória príjemcov",
        body: "orgány činné v trestnom konaní, orgány prejednávajúce priestupky, poisťovne, prípadne všeobecné súdy SR v prípade preukazovania okolností spáchania protiprávnej činnosti a odhaľovaní jej páchateľa",
      },
      {
        label: "Označenie tretej krajiny alebo medzinárodnej organizácie",
        body: "prenos do tretej krajiny sa neuskutočňuje",
      },
      {
        label: "Bezpečnostné opatrenia (technické a organizačné)",
        body: "bezpečnostná smernica prevádzkovateľa",
      },
    ],
  },
  {
    title: "správa registratúry, archivovanie dokumentov, evidencia pošty",
    entries: [
      {
        label: "Právny základ spracovateľskej činnosti",
        body: "zákon č. 395/2002 Z. z. o archívoch a registratúrach.",
      },
      {
        label: "Kategórie dotknutých osôb",
        body: "zamestnanci, klienti, bývalí zamestnanci, rodinní príslušníci zamestnancov, osoby oprávnené konať v mene obchodných partnerov prevádzkovateľa, poverený zamestnanec obchodného partnera prevádzkovateľa, iné fyzické osoby, ktoré sú súčasťou zmluvnej dokumentácie prevádzkovateľa",
      },
      {
        label: "Kategória osobných údajov",
        body: `bežné osobné údaje, osobné údaje nachádzajúce sa v dokumentoch podliehajúcich archivácií`,
      },
      {
        label: "Lehota na výmaz OÚ",
        body: "jednotlivé dokumenty podľa archivačného a registratúrneho poriadku spoločnosti",
      },
      {
        label: "Kategória príjemcov",
        body: "zamestnanci prevádzkovateľa, subjekty ktorým je prevádzkovateľ povinný poskytnúť osobné údaje zo zákona, členovia orgánov spoločnosti prevádzkovateľa",
      },
      {
        label: "Označenie tretej krajiny alebo medzinárodnej organizácie",
        body: "prenos do tretej krajiny sa neuskutočňuje",
      },
      {
        label: "Bezpečnostné opatrenia (technické a organizačné)",
        body: "bezpečnostná smernica prevádzkovateľa",
      },
    ],
  },
  {
    title: "evidencia dochádzky zamestnancov",
    entries: [
      {
        label: "Právny základ spracovateľskej činnosti",
        body: "Zákon č. 311/2001 Z. z. Zákonník práce.  ",
      },
      {
        label: "Kategórie dotknutých osôb",
        body: "zamestnanci",
      },
      {
        label: "Kategória osobných údajov",
        body: `bežné osobné údaje nevyhnutné na zabezpečenie dochádzky zamestnancov, a to: titul, meno a priezvisko, čas príchodu a čas odchodu do/z práce`,
      },
      {
        label: "Lehota na výmaz OÚ",
        body: "5 rokov od vyhodnotenia dochádzky",
      },
      {
        label: "Kategória príjemcov",
        body: "zamestnanci prevádzkovateľa, subjekty, ktorým je prevádzkovateľ povinný poskytnúť osobné údaje zo zákona, napr. Inšpektorát práce.",
      },
      {
        label: "Označenie tretej krajiny alebo medzinárodnej organizácie",
        body: "prenos do tretej krajiny sa neuskutočňuje",
      },
      {
        label: "Bezpečnostné opatrenia (technické a organizačné)",
        body: "bezpečnostná smernica prevádzkovateľa",
      },
    ],
  },
  {
    title: "uplatňovanie právnych nárokov",
    entries: [
      {
        label: "Právny základ spracovateľskej činnosti",
        body: "oprávnený záujem prevádzkovateľa v zmysle čl. 6 ods. 1 písm. f) Nariadenia.Hlavným oprávneným záujmom je uplatňovanie právnych nárokov na súde, a to podľa zákona č. 64/1964 Zb. Občiansky zákonník, zákona č. 513/1991 Zb. Obchodný zákonník, zákona č. 311/2001 Z. z. Zákonník práce, zákona č. 160/2015 Z. z. Civilný sporový poriadok, zákona č. 161/2015 Civilný mimosporový poriadok, zákona č. 162/2015 Z. z. Správny súdny poriadok a súvisiacich právnych predpisov",
      },
      {
        label: "Kategórie dotknutých osôb",
        body: "zmluvní obchodní partneri a zamestnanci prevádzkovateľa a iné fyzické osoby, vo vzťahu ku ktorým prevádzkovateľ uplatňuje svoje nároky",
      },
      {
        label: "Kategória osobných údajov",
        body: `kontaktné osobné údaje ako meno, priezvisko, adresa trvalého bydliska, miesto podnikania, číslo OP, ďalšie osobné údaje nevyhnutné na splnenie zákonných požiadaviek pri uplatňovaní práv`,
      },
      {
        label: "Lehota na výmaz OÚ",
        body: "po úplnom uspokojení pohľadávky prevádzkovateľa alebo úplnom zániku práv a záväzkov z právneho vzťahu, z ktorého sa nároky uplatňovali",
      },
      {
        label: "Kategória príjemcov",
        body: "orgány verejnej správy, všeobecné súdy SR, advokáti, exekútori, notári, poisťovne",
      },
      {
        label: "Označenie tretej krajiny alebo medzinárodnej organizácie",
        body: "prenos do tretej krajiny sa neuskutočňuje",
      },
      {
        label: "Bezpečnostné opatrenia (technické a organizačné)",
        body: "bezpečnostná smernica prevádzkovateľa",
      },
    ],
  },
];

const PERSONAL_RIGHTS: string[] = [
  "Požadovať prístup k osobným údajom týkajúcich sa dotknutej osoby. Ako dotknutá osoba máte právo na poskytnutie zoznamu osobných údajov, ktoré od Vás máme k dispozícii ako aj informácie o tom ako Vaše osobné údaje spracúvame.",
  "Na opravu osobných údajov. Prijali sme opatrenia, aby sme uchovávali Vaše presné, úplné a aktuálne osobné údaje. Ak si myslíte, že Vaše osobné údaje, ktoré uchovávame nie sú presné, úplné a aktuálne, prosím informujte nás o tom.",
  "Na vymazanie osobných údajov. Ako dotknutá osoba nás môžete požiadať aj o vymazanie Vašich osobných údajov, ak sú na to splnené zákonom uvedené dôvody, napr. ak už účel spracúvania skončil.",
  "Na obmedzenie spracúvania osobných údajov. Ako dotknutá osoba nás môžete pri splnení zákonných podmienok požiadať, aby sme prestali používať Vaše osobné údaje, napr. za situácie ak si myslíte, že Vaše osobné údaje, ktoré uchovávame, sú nepresné a pod.",
  "Namietať spracúvanie osobných údajov. Ako dotknutá osoba máte právo namietať spracúvaniu Vašich údajov, v prípade, ak ste nadobudli presvedčenie, že na spracúvanie osobných údajov nemáme právny dôvod; napr. ak naše oprávnené záujmy na spracúvanie osobných údajov neprevažujú nad právami alebo záujmami dotknutej osoby.",
  "Odvolať súhlas. Ako dotknutá osoba máte právo kedykoľvek odvolať Váš súhlas v prípadoch, keď Vaše osobné údaje spracúvame na základe Vášho súhlasu.",
  "Na prenosnosť osobných údajov. Ako dotknutá osoba máte za určitých okolností právo požiadať nás o prenos osobných údajov, ktoré ste nám Toto právo na prenosnosť sa však týka len tých osobných údajov, ktoré sme nám poskytli na základe Vášho súhlasu alebo na základe zmluvy, ktorej ste jednou zo zmluvných strán.",
  "Podať návrh na začatie konania resp. sťažnosť na dozorný orgán. Ako dotknutá osoba máte právo podať návrh resp. sťažnosť na Úrad na ochranu osobných údajov Slovenskej republiky, https://dataprotection.gov.sk , Námestie 1.mája 18, 811 06 Bratislava; tel. číslo: +421 /2/ 3231 3214; E-mail: dozor@pdp.gov.sk",
];

export default function TermOfCondition() {
  const { t } = useTranslation();
  return (
    <section className="relative space-y-25 overflow-hidden">
      <div className="relative z-10 container mx-auto px-13 pt-52.5 pb-25">
        <div className="mb-25 text-center text-5xl font-bold uppercase">
          <h1>{t("terms.title")}</h1>
        </div>
        <div className="space-y-25">
          {TERMS_SECTIONS.map((section) => {
            return (
              <div className="space-y-7.5">
                <ScrollReveal amount={0.35} className="space-y-7.5">
                  <ScrollReveal amount={0.35}>
                    <div className="text-4xl font-bold capitalize">
                      <h1>{section.title}</h1>
                    </div>
                  </ScrollReveal>
                  <div className="space-y-7.5">
                    {section.entries.map((entry) => {
                      return (
                        <ScrollReveal amount={0.35}>
                          <div className="space-y-2">
                            <div className="text-lg font-semibold uppercase">
                              <h1>{entry.label}</h1>
                            </div>
                            <div
                              className="text-foreground/70"
                              style={{ whiteSpace: "pre-line" }}
                            >
                              <p>{entry.body}</p>
                            </div>
                          </div>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                </ScrollReveal>
              </div>
            );
          })}
        </div>
      </div>
      <div className="container space-y-15">
        <div className="flex flex-col justify-center space-y-7.5 text-center">
          <h1 className="text-5xl font-bold">{t("terms.rightsTitle")}</h1>
          <h1 className="text-xl font-semibold uppercase">
            {t("terms.rightsSubtitle")}
          </h1>
        </div>
        <div className="space-y-7.5">
          {PERSONAL_RIGHTS.map((right, index) => (
            <div className="flex gap-7">
              <p className="text-lg">{index + 1}.</p>
              <p>{right}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
