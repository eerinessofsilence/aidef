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
];

export default function TermOfCondition() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-13 pt-52.5 pb-25">
        <div className="mb-25 text-center text-5xl font-bold uppercase">
          <h1>Terms of Condition</h1>
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
                            <div className="text-foreground/70">
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
    </section>
  );
}
