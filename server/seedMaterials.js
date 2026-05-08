const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Material = require('./models/Material');
const User = require('./models/User');

dotenv.config();

const materialsData = [
  {
    weekNumber: 1,
    title: "Bevezetés és Alapok",
    subject: "C Programozás",
    description: "A C egy strukturált, alacsony szintű memóriakezelést is megengedő nyelv. Ebben a leckében megismerkedünk a program kötelező elemeivel és a konzolos kiírással/beolvasással.\n\n" +
                 "🔍 Fontos kulcsszavak:\n" +
                 "• #include <stdio.h>: A Standard Input/Output könyvtár beemelése (printf és scanf miatt).\n" +
                 "• int main(): A főprogram, a futás mindig innen indul.\n" +
                 "• printf(): Szöveg kiírása a képernyőre. A '\\n' sortörést jelent.\n" +
                 "• scanf(): Adat beolvasása a billentyűzetről. A '%d' egész számot (integer), a '%f' tizedestörtet (float) vár.\n" +
                 "• return 0: Jelzi az operációs rendszernek, hogy a program hiba nélkül lefutott.",
    language: "c",
    codeSnippet: `// --- 1. PÉLDA: Egyszerű Hello World ---
#include <stdio.h>

int main() {
    printf("Udv a C programozas vilagaban!\\n");
    return 0;
}

// --- 2. PÉLDA: Valtozok es beolvasas ---
#include <stdio.h>

int main() {
    int eletkor; // Egesz szam valtozo deklaralasa
    
    printf("Hany eves vagy? ");
    scanf("%d", &eletkor); // A & (cimkepzo) kötelező scanf-nel!
    
    printf("Tehat %d eves vagy. Szuper!\\n", eletkor);
    return 0;
}`
  },
  {
    weekNumber: 2,
    title: "Operátorok és Kifejezések",
    subject: "C Programozás",
    description: "A változókkal különböző műveleteket végezhetünk matematikai és logikai operátorok segítségével.\n\n" +
                 "🔍 Főbb operátor típusok:\n" +
                 "• Aritmetikai: +, -, *, /, % (modulo - maradékos osztás).\n" +
                 "• Relációs (összehasonlító): == (egyenlő), != (nem egyenlő), >, <, >=, <=.\n" +
                 "• Logikai: && (ÉS), || (VAGY), ! (NEM).\n" +
                 "• Castolás: Ha két egészet (int) osztunk, az eredmény is egész lesz (levágja a tört részt). Ha pontos eredményt akarunk, az egyiket 'float'-tá kell alakítanunk.",
    language: "c",
    codeSnippet: `// --- 1. PÉLDA: Maradékos osztás és Castolás ---
#include <stdio.h>

int main() {
    int a = 10, b = 3;
    
    // Maradekos osztas: 10-ben a 3 megvan 3-szor, a maradek 1.
    int maradek = a % b; 
    
    // Explicit tipuskonverzio (castolas) tizedestortte
    float pontos_osztas = (float)a / b; 
    
    printf("Maradek: %d\\n", maradek);
    printf("Pontos osztas: %.2f\\n", pontos_osztas); // %.2f: 2 tizedesjegy
    
    return 0;
}`
  },
  {
    weekNumber: 3,
    title: "Vezérlési Szerkezetek I. (Elágazások)",
    subject: "C Programozás",
    description: "Alapértelmezetten a C programok sorról sorra hajtódnak végre, de a valóságban sokszor feltételek alapján döntéseket kell hoznunk.\n\n" +
                 "1. Az 'if-else' szerkezet:\n" +
                 "Lehetővé teszi, hogy egy feltétel igaz vagy hamis volta alapján más-más kódblokk fusson le.\n\n" +
                 "2. A 'switch-case' szerkezet:\n" +
                 "Amikor egyetlen változó konkrét értékét vizsgáljuk, a switch átláthatóbb.\n\n" +
                 "🔍 Fontos kulcsszavak:\n" +
                 "• switch(változó): Ezt a változót vizsgáljuk.\n" +
                 "• case X: Ha az érték pontosan X, innen indul a futás.\n" +
                 "• break: Megállítja a futást az adott ágban. Nélküle a kód tovább futna a következő case-ekre is!\n" +
                 "• default: Olyan, mint az 'else', akkor fut, ha egyik case sem egyezik.",
    language: "c",
    codeSnippet: `// --- 1. PÉLDA: if-else szerkezet ---
#include <stdio.h>

int main() {
    int pont = 85;
    if (pont >= 90) {
        printf("Kivalo!\\n");
    } else if (pont >= 50) {
        printf("Atment.\\n");
    } else {
        printf("Megbukott.\\n");
    }

// --- 2. PÉLDA: switch-case szerkezet ---
    int jegy = 4;
    switch(jegy) {
        case 5: printf("Jeles\\n"); break;
        case 4: printf("Jo\\n"); break;
        case 3: printf("Kozepes\\n"); break;
        case 2: printf("Elegseges\\n"); break;
        case 1: printf("Elegtelen\\n"); break;
        default: printf("Hibas adat!\\n");
    }
    return 0;
}`
  },
  {
    weekNumber: 4,
    title: "Vezérlési Szerkezetek II. (Ciklusok)",
    subject: "C Programozás",
    description: "A ciklusok (loopok) segítségével ugyanazt a kódblokkot többször is végrehajthatjuk, amíg egy feltétel igaz.\n\n" +
                 "🔍 Ciklus típusok:\n" +
                 "• for: Akkor használjuk, ha előre tudjuk, hányszor akarunk ismételni. Részei: (inicializálás; feltétel; léptetés).\n" +
                 "• while: Akkor jó, ha nem tudjuk a lépésszámot, csak egy feltétel teljesüléséig futtatjuk.\n" +
                 "• do-while: Hasonló a while-hoz, de a magja legalább EGYSZER mindenképp lefut, mert a feltétel vizsgálata a végén történik.\n\n" +
                 "• break: Azonnal megszakítja a teljes ciklust.\n" +
                 "• continue: Átugorja a jelenlegi iterációt, és a következő lépéssel folytatja.",
    language: "c",
    codeSnippet: `// --- 1. PÉLDA: For ciklus (1-tol 5-ig) ---
#include <stdio.h>

int main() {
    for (int i = 1; i <= 5; i++) {
        if (i == 3) continue; // A 3-ast kiugorjuk
        printf("%d ", i);
    }
    printf("\\n");

// --- 2. PÉLDA: While ciklus (Szamok osszegzese) ---
    int osszeg = 0;
    int szam = 5;
    
    while (szam > 0) {
        osszeg += szam;
        szam--; // Csokkentes 1-gyel
    }
    printf("Az elso 5 szam osszege: %d\\n", osszeg);
    
    return 0;
}`
  },
  {
    weekNumber: 5,
    title: "Tömbök és Karaktersorozatok",
    subject: "C Programozás",
    description: "Ha sok azonos típusú adatot akarunk tárolni (pl. 30 diák jegyét), nem hozunk létre 30 változót, hanem egy Tömböt (Array) használunk.\n\n" +
                 "🔍 Fontos tudnivalók:\n" +
                 "• Indexelés: A C nyelvben az indexelés 0-tól kezdődik! A 3. elem az a tömb[2].\n" +
                 "• Fix méret: A memóriában előre le kell foglalni a helyet, a tömb mérete futás közben nem nőhet meg automatikusan.\n" +
                 "• Sztringek (Szövegek): A C-ben nincs külön 'string' típus. A szöveg valójában egy karakterekből álló tömb (char[]). A szöveg végét mindig egy speciális null-karakter ('\\0') jelzi a memóriában.",
    language: "c",
    codeSnippet: `// --- 1. PÉLDA: Számok tömbje ---
#include <stdio.h>

int main() {
    // 5 elemu tomb letrehozasa es feltoltese
    int jegyek[5] = {4, 5, 3, 5, 2};
    int osszeg = 0;
    
    for(int i = 0; i < 5; i++) {
        osszeg += jegyek[i];
    }
    printf("Atlag: %.2f\\n", (float)osszeg / 5);

// --- 2. PÉLDA: Szöveg (Karaktertömb) ---
    char nev[] = "Kovacs";
    
    // Egy karakter megvaltoztatasa
    nev[0] = 'L';
    
    // Kimenet: Lovacs
    printf("A modositas utan: %s\\n", nev); 
    
    return 0;
}`
  },
  {
    weekNumber: 6,
    title: "Függvények (Functions)",
    subject: "C Programozás",
    description: "A moduláris programozás alapja. A hosszú kódot kisebb, újrahasználható blokkokra bontjuk. Egy függvény bemeneti adatokat (paramétereket) kap, azokon dolgozik, majd visszaadhat (return) egy eredményt.\n\n" +
                 "🔍 Szerkezet:\n" +
                 "[Visszatérési típus] [Függvény Neve]([Paraméterek]) { ...kód... }\n\n" +
                 "• Ha a függvény nem ad vissza semmit, a típusa 'void'.\n" +
                 "• Hatókör (Scope): Egy függvényen belül létrehozott változó csak azon a függvényen belül létezik (lokális változó). A main() nem látja a többi függvény változóit.",
    language: "c",
    codeSnippet: `#include <stdio.h>

// 1. PÉLDA: Értéket visszaadó függvény
int negyzet(int szam) {
    return szam * szam;
}

// 2. PÉLDA: Nem visszaadó (void) függvény
void udvozol(char nev[]) {
    printf("Szia, %s!\\n", nev);
}

int main() {
    int x = 5;
    int eredmeny = negyzet(x); // Fuggvenyhivas
    
    printf("%d négyzete: %d\\n", x, eredmeny);
    
    udvozol("Hallgato");
    return 0;
}`
  },
  {
    weekNumber: 7,
    title: "A Mutatók (Pointers) Alapjai",
    subject: "C Programozás",
    description: "A pointerek a C nyelv legnehezebb, de legfontosabb eszközei. A mutató nem egy konkrét értéket (pl. 5-öt) tárol, hanem egy memóriacímet, ahol egy adat található.\n\n" +
                 "🔍 Operátorok:\n" +
                 "• & (Címképző): Megadja egy változó fizikai memóriacímét (pl. hol lakik az adat a RAM-ban).\n" +
                 "• * (Indirekció): A pointer elé téve 'követi a nyilat', azaz kiolvassa vagy felülírja az adott memóriacímen lévő értéket.\n\n" +
                 "Miért jó ez? Függvényeknél, ha csak az értéket adjuk át (pass-by-value), a függvény egy másolaton dolgozik. Ha memóriacímet adunk át (pass-by-reference), a függvény az eredeti változót tudja módosítani.",
    language: "c",
    codeSnippet: `// --- PÉLDA: Változók értékének megcserélése pointerekkel ---
#include <stdio.h>

// A fuggveny pointereket (memoriacimeket) var parameterkent
void csere(int *a, int *b) {
    int temp = *a; // Kiolvassuk az 'a' cimen levo erteket
    *a = *b;       // Felulirjuk az 'a' cimet a 'b' ertekevel
    *b = temp;     // A 'b' cimebe betesszuk az elmentett temp erteket
}

int main() {
    int x = 10, y = 20;
    
    printf("Elotte: x=%d, y=%d\\n", x, y);
    
    // Atadjuk az x es y valtozok cimet a & operatorral
    csere(&x, &y); 
    
    printf("Utana: x=%d, y=%d\\n", x, y);
    return 0;
}`
  },
  {
    weekNumber: 8,
    title: "Dinamikus Memóriakezelés",
    subject: "C Programozás",
    description: "Eddig a tömbök méretét előre meg kellett adnunk a kódoláskor (pl. int tomb[100]). De mi van, ha csak futás közben, a felhasználó mondja meg, hány adatra van szükség? Erre való a memóriafoglalás a Heap-en (Kupac memóriaterület).\n\n" +
                 "🔍 Fontos függvények (<stdlib.h>):\n" +
                 "• malloc(méret byte-ban): Lefoglalja a kért memóriát, és visszaad egy pointert a blokk elejére.\n" +
                 "• sizeof(típus): Megmondja, hány byte-ot foglal a memóriában egy adott típus.\n" +
                 "• free(pointer): KÖTELEZŐ! Felszabadítja a lefoglalt területet. Ha elfelejtjük, memóriaszivárgás (memory leak) lép fel, és a program felzabálja a RAM-ot.",
    language: "c",
    codeSnippet: `#include <stdio.h>
#include <stdlib.h> // A malloc es free miatt kell!

int main() {
    int meret;
    printf("Hany szamot akarsz tarolni? ");
    scanf("%d", &meret);
    
    // Dinamikus tomb lefoglalasa. 
    // meret * 4 byte (egy int merete) = n byte
    int *tomb = (int*)malloc(meret * sizeof(int));
    
    // Ellenorzes: sikerult-e a foglalás?
    if (tomb == NULL) {
        printf("Memoriafoglalasi hiba!\\n");
        return 1;
    }
    
    // Feltoltes es kiiras
    for(int i = 0; i < meret; i++) {
        tomb[i] = i * 2;
        printf("%d ", tomb[i]);
    }
    printf("\\n");
    
    // Felszabaditas (Kritikusan fontos!)
    free(tomb);
    
    return 0;
}`
  },
  {
    weekNumber: 9,
    title: "Haladó Sztringkezelés",
    subject: "C Programozás",
    description: "A C-ben a szövegek egyszerű karaktertömbök, ezért nem használhatjuk rájuk a == vagy a = operátorokat közvetlenül. A szöveges műveletekhez a <string.h> könyvtár beépített függvényeit kell használnunk.\n\n" +
                 "🔍 Fontos függvények:\n" +
                 "• strlen(s1): Visszaadja a szöveg valós hosszát (a lezáró '\\0' nélkül).\n" +
                 "• strcpy(cel, forras): Átmásolja a forrás szöveget a cél tömbbe.\n" +
                 "• strcmp(s1, s2): Összehasonlít két szöveget. Ha az eredmény 0, akkor a két szöveg tökéletesen megegyezik.\n" +
                 "• strcat(cel, forras): Hozzáfűzi a cél szöveg végéhez a forrás szöveget.",
    language: "c",
    codeSnippet: `#include <stdio.h>
#include <string.h>

int main() {
    char jelszo_adatbazisban[] = "Titok123";
    char bemenet[50];
    
    printf("Kerem a jelszot: ");
    scanf("%s", bemenet);
    
    // Összehasonlítás. Ha 0, akkor a karakterek egyeznek.
    if (strcmp(bemenet, jelszo_adatbazisban) == 0) {
        printf("Helyes jelszo!\\n");
    } else {
        printf("Helytelen jelszo!\\n");
    }
    
    // Szövegek összefűzése
    char koszonto[100] = "Udv a rendszerben, ";
    char nev[] = "Adminisztrator";
    
    strcat(koszonto, nev);
    printf("%s\\n", koszonto);
    
    return 0;
}`
  },
  {
    weekNumber: 10,
    title: "Struktúrák (Structs)",
    subject: "C Programozás",
    description: "Amikor összetett adatokat akarunk tárolni (pl. egy Diák adatait: név, kor, átlag), nem érdemes külön változókat létrehozni. A struktúrák (struct) segítségével saját adattípusokat hozhatunk létre, amik különböző típusú változókat csomagolnak egybe.\n\n" +
                 "🔍 Használat:\n" +
                 "• A 'typedef' kulcsszóval nevet adhatunk a struktúránknak, így később úgy használhatjuk, mint egy beépített típust (pl. int).\n" +
                 "• A struktúra belső elemeire (tagjaira) a pont (.) operátorral hivatkozunk.\n" +
                 "• Ha a struktúrára egy pointer mutat, akkor a pont helyett a nyíl (->) operátort kell használni.",
    language: "c",
    codeSnippet: `#include <stdio.h>
#include <string.h>

// Sajat adattipus letrehozasa
typedef struct {
    char nev[50];
    int kor;
    float atlag;
} Diak;

int main() {
    // Egy Diak tipusu valtozo letrehozasa
    Diak d1;
    
    // Adatok feltoltese a pont operatorral
    strcpy(d1.nev, "Nagy Peter");
    d1.kor = 21;
    d1.atlag = 4.75;
    
    printf("A diak neve: %s\\n", d1.nev);
    printf("Kora: %d ev, Atlaga: %.2f\\n", d1.kor, d1.atlag);
    
    // Strukturabol is lehet tombot kesziteni!
    Diak nevsor[30]; 
    
    return 0;
}`
  },
  {
    weekNumber: 11,
    title: "Fájlkezelés I/O",
    subject: "C Programozás",
    description: "Amikor a programunk bezárul, a RAM-ban lévő változók elvesznek. Ha tartósan szeretnénk adatot tárolni (perzisztencia), fájlokat kell használnunk a merevlemezen.\n\n" +
                 "🔍 Folyamat:\n" +
                 "1. FILE mutató létrehozása.\n" +
                 "2. Fájl megnyitása az fopen() függvénnyel. Módok: 'r' (olvasás), 'w' (írás - felülírja a meglévőt), 'a' (hozzáfűzés - a végéhez ír).\n" +
                 "3. Ellenőrzés, hogy sikerült-e megnyitni a fájlt.\n" +
                 "4. Írás az fprintf() vagy olvasás az fscanf() függvénnyel.\n" +
                 "5. A fájl lezárása az fclose() függvénnyel (Kritikus lépés!).",
    language: "c",
    codeSnippet: `#include <stdio.h>

int main() {
    // Fajl megnyitasa írásra ("w" - write)
    FILE *fajl = fopen("adatok.txt", "w");
    
    // Mindig ellenorizzuk, hogy sikerult-e megnyitni!
    if (fajl == NULL) {
        printf("Hiba a fajl megnyitasakor!\\n");
        return 1;
    }
    
    // Szöveg es valtozok irasa a fajlba
    int pont = 100;
    fprintf(fajl, "Ez egy kimentett adat.\\n");
    fprintf(fajl, "A felhasznalo pontszama: %d\\n", pont);
    
    // Fajl lezarasa
    fclose(fajl);
    
    printf("Adatok sikeresen elmentve az adatok.txt fajlba.\\n");
    return 0;
}`
  },
  {
    weekNumber: 12,
    title: "Preprocesszor és Makrók",
    subject: "C Programozás",
    description: "A fordítási folyamat (kompilálás) első lépése a preprocesszálás. A '#' jellel kezdődő sorok a fordítónak szólnak, még mielőtt a tényleges kód gépi kódra fordulna.\n\n" +
                 "🔍 Eszközök:\n" +
                 "• #include: Beemel egy külső könyvtárat.\n" +
                 "• #define CONSTANS ERTEK: Létrehoz egy konstanst. A fordító egyszerűen kicseréli a szövegben a konstanst a megadott értékre.\n" +
                 "• Makrók: Olyanok, mint a paraméteres függvények, de gyorsabbak, mert a preprocesszor behelyettesíti a kódot a függvényhívás helyére.\n" +
                 "• Vigyázat! A makróknál mindig használjunk bőségesen zárójeleket a műveleti sorrendi hibák elkerülése végett.",
    language: "c",
    codeSnippet: `#include <stdio.h>

// Konstans definialasa (Csupa nagybetu a konvencio)
#define PI 3.14159
#define MAX_MERET 100

// Makro definialasa
// Miért kell ennyi zárójel? Mert a makró csak vakon szöveget cserél!
#define MAX_SZAM(a, b) ((a) > (b) ? (a) : (b))

int main() {
    float sugar = 5.0;
    float kerulet = 2 * PI * sugar;
    
    int x = 15, y = 30;
    
    printf("A kor kerulete: %.2f\\n", kerulet);
    printf("A nagyobb szam: %d\\n", MAX_SZAM(x, y));
    
    return 0;
}`
  },
  {
    weekNumber: 13,
    title: "Láncolt Listák (Linked Lists)",
    subject: "C Programozás",
    description: "A tömbök hátránya, hogy a méretük fix, vagy folyamatos, nagy memóriablokkot igényelnek. A Láncolt Lista egy olyan dinamikus adatszerkezet, ahol az adatelemek (Csomópontok / Nodes) szétszórva lehetnek a memóriában, és egymásra mutatnak (pointerekkel).\n\n" +
                 "🔍 Szerkezet:\n" +
                 "Minden csomópont tartalmaz:\n" +
                 "1. Magát az adatot (pl. egy szám).\n" +
                 "2. Egy pointert, ami a lista következő elemére mutat (next).\n" +
                 "A lista utolsó elemének pointere NULL értéket vesz fel, így tudjuk, hogy ott a vége.",
    language: "c",
    codeSnippet: `#include <stdio.h>
#include <stdlib.h>

// Csomopont (Node) struktura definialasa
typedef struct Node {
    int adat;
    struct Node* kovetkezo; // Pointer a sajat tipusara
} Node;

int main() {
    // 3 elem dinamikus lefoglalasa
    Node* fej = (Node*)malloc(sizeof(Node));
    Node* masodik = (Node*)malloc(sizeof(Node));
    Node* harmadik = (Node*)malloc(sizeof(Node));
    
    // Adatok feltoltese es osszelancolas
    fej->adat = 10;
    fej->kovetkezo = masodik; // A fej a masodikra mutat
    
    masodik->adat = 20;
    masodik->kovetkezo = harmadik;
    
    harmadik->adat = 30;
    harmadik->kovetkezo = NULL; // A lista vege
    
    // Lista bejarasa es kiirasa
    Node* aktualis = fej;
    while(aktualis != NULL) {
        printf("%d -> ", aktualis->adat);
        aktualis = aktualis->kovetkezo; // Lepes a kovetkezo elemre
    }
    printf("NULL\\n");
    
    // Memoria felszabaditas (egyesével kell!)
    free(fej); free(masodik); free(harmadik);
    
    return 0;
}`
  },
  {
    weekNumber: 14,
    title: "Szemeszter Összefoglalás és Vizsga",
    subject: "C Programozás",
    description: "A félév utolsó hetén a korábban tanult elemeket integráljuk komplex, valós problémák megoldására. Megismerkedünk a többfájlos programozással (.h header és .c source fájlok) és az alapvető hibakeresési (debugging) technikákkal.\n\n" +
                 "Ebben a stádiumban a diákoknak már képesnek kell lenniük memóriaszivárgás nélküli, biztonságos C kódot írniuk fájlkezeléssel és dinamikus adatszerkezetekkel ötvözve.\n\n" +
                 "Sok sikert a záróvizsgához!",
    language: "c",
    codeSnippet: `// Pelda egy komplexebb program főszerkezetére
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Sajat headerek beemelese a valosagban:
// #include "adatbazis.h"
// #include "lista.h"

int main() {
    printf("==== C PROGRAMOZAS ZAROVIZSGA ====\\n");
    printf("Rendszer inicializalasa...\\n");
    
    // Ide jon a komplex logika:
    // 1. Fajl beolvasasa láncolt listába
    // 2. Felhasznaloi menu kezelese (switch-case)
    // 3. Adatok modositasa memoria mutatokkal
    // 4. Eredmeny visszairasa a fajlba es free() hivasa
    
    printf("A program sikeresen lefutott.\\n");
    return 0;
}`
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Sikeres adatbázis kapcsolat!');

    const teacher = await User.findOne({ role: 'teacher' });
    
    if (!teacher) {
      console.log('❌ Nincs tanár az adatbázisban! Előbb regisztrálj egy tanárt az oldalon!');
      process.exit(1);
    }

    console.log(`👨‍🏫 Kijelölt tanár: ${teacher.username}`);

    await Material.deleteMany({ subject: "C Programozás" });
    console.log('🗑️ Korábbi teszt adatok törölve.');

    const materialsWithTeacher = materialsData.map(material => ({
      ...material,
      teacherId: teacher._id
    }));

    await Material.insertMany(materialsWithTeacher);
    console.log('🚀 SIKER! 14 hetes C Programozás tananyag (teljes magyarázatokkal) feltöltve!');

  } catch (err) {
    console.error('❌ Hiba történt:', err);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

seedDB();