const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Quiz = require('./models/Quiz');
const User = require('./models/User');
const Question = require('./models/Question');

dotenv.config();

// ITT VANNAK A KÉRDÉSEK:
const quizzesData = [
  {
    weekNumber: 1,
    title: "1. Hét: Bevezetés és Alapok",
    description: "Ellenőrizd a tudásod a C programozás alapjaiból!",
    difficulty: "easy",
    questions: [
      {
        questionText: "Melyik függvényt használjuk a C nyelvben formázott szöveg és változók értékének konzolra történő kiírására?",
        options: ["cout", "print()", "printf()", "System.out.println()"],
        correctAnswerIndex: 2
      }
    ]
  },
  {
    weekNumber: 2,
    title: "2. Hét: Operátorok és Kifejezések",
    description: "Mennyire ismered a C nyelv operátorait?",
    difficulty: "easy",
    questions: [
      {
        questionText: "Mi lesz az eredménye a `10 % 3` kifejezésnek a C nyelvben?",
        options: ["3", "3.33", "1", "0"],
        correctAnswerIndex: 2
      }
    ]
  },
  {
    weekNumber: 3,
    title: "3. Hét: Vezérlési Szerkezetek I.",
    description: "Teszteld a tudásod az if-else és a switch-case szerkezetekről!",
    difficulty: "medium",
    questions: [
      {
        questionText: "Mi történik, ha egy `switch` szerkezet egyik `case` ágának végéről lehagyjuk a `break` utasítást?",
        options: [
          "Szintaktikai hibát kapunk fordításkor.",
          "A program futása megáll és kilép.",
          "A végrehajtás 'beesik' (fall-through) a következő case ágba is.",
          "Csak az alapértelmezett (default) ág fog lefutni."
        ],
        correctAnswerIndex: 2
      }
    ]
  },
  {
    weekNumber: 4,
    title: "4. Hét: Vezérlési Szerkezetek II.",
    description: "Ciklusok (for, while, do-while) és iterációk a gyakorlatban.",
    difficulty: "medium",
    questions: [
      {
        questionText: "Melyik ciklus garantálja, hogy a magjában lévő utasítások legalább EGYSZER mindenképpen lefutnak?",
        options: ["for ciklus", "while ciklus", "do-while ciklus", "Egyik sem"],
        correctAnswerIndex: 2
      }
    ]
  },
  {
    weekNumber: 5,
    title: "5. Hét: Tömbök és Karaktersorozatok",
    description: "Hogyan működnek a tömbök és a C-sztringek?",
    difficulty: "medium",
    questions: [
      {
        questionText: "Melyik karakter jelzi egy C-sztring (karaktertömb) végét a memóriában?",
        options: ["\\n", "\\0", "EOF", "."],
        correctAnswerIndex: 1
      }
    ]
  },
  {
    weekNumber: 6,
    title: "6. Hét: Függvények (Functions)",
    description: "Függvények deklarálása, paraméterek és visszatérési értékek.",
    difficulty: "medium",
    questions: [
      {
        questionText: "Milyen visszatérési típust kell megadni egy olyan függvénynek, amely elvégzi a feladatát, de nem ad vissza semmilyen értéket?",
        options: ["null", "int", "void", "empty"],
        correctAnswerIndex: 2
      }
    ]
  },
  {
    weekNumber: 7,
    title: "7. Hét: A Mutatók (Pointers) Alapjai",
    description: "A C nyelv legfontosabb koncepciója: a memóriacímek és mutatók.",
    difficulty: "hard",
    questions: [
      {
        questionText: "Melyik operátort használjuk C nyelvben egy változó fizikai memóriacímének lekérdezésére (címképzésre)?",
        options: ["* (Csillag)", "& (És jel)", "-> (Nyíl)", "% (Százalék)"],
        correctAnswerIndex: 1
      }
    ]
  },
  {
    weekNumber: 8,
    title: "8. Hét: Dinamikus Memóriakezelés",
    description: "A malloc() és free() függvények használata.",
    difficulty: "hard",
    questions: [
      {
        questionText: "Mi történik legvalószínűbben, ha dinamikusan memóriát foglalunk a `malloc` segítségével, de elfelejtjük meghívni a `free` függvényt?",
        options: [
          "A fordító szintaktikai hibát jelez.",
          "A memória automatikusan felszabadul a függvény végén.",
          "Memóriaszivárgás (memory leak) jön létre.",
          "A program azonnal összeomlik."
        ],
        correctAnswerIndex: 2
      }
    ]
  },
  {
    weekNumber: 9,
    title: "9. Hét: Haladó Sztringkezelés",
    description: "A <string.h> könyvtár beépített függvényei.",
    difficulty: "medium",
    questions: [
      {
        questionText: "Melyik könyvtári függvényt kell használni két C-sztring (karaktertömb) tartalmának biztonságos összehasonlítására?",
        options: ["== operátor", "strcmp()", "strcat()", "equals()"],
        correctAnswerIndex: 1
      }
    ]
  },
  {
    weekNumber: 10,
    title: "10. Hét: Struktúrák (Structs)",
    description: "Saját összetett adattípusok létrehozása.",
    difficulty: "medium",
    questions: [
      {
        questionText: "Milyen operátorral hivatkozunk egy struktúra belső elemére (tagjára), ha közvetlenül magát a változót használjuk?",
        options: ["Nyíl operátor (->)", "Pont operátor (.)", "Kettőspont (:)", "Index operátor ([])"],
        correctAnswerIndex: 1
      }
    ]
  },
  {
    weekNumber: 11,
    title: "11. Hét: Fájlkezelés I/O",
    description: "Szöveges fájlok írása és olvasása (fopen, fclose).",
    difficulty: "hard",
    questions: [
      {
        questionText: "Melyik móddal kell megnyitni egy szöveges fájlt az `fopen` függvénnyel, ha annak a meglévő tartalma végéhez szeretnénk új adatokat hozzáfűzni?",
        options: ["\"r\"", "\"w\"", "\"a\"", "\"x\""],
        correctAnswerIndex: 2
      }
    ]
  },
  {
    weekNumber: 12,
    title: "12. Hét: Preprocesszor és Makrók",
    description: "Konstansok és fordítás előtti direktívák.",
    difficulty: "hard",
    questions: [
      {
        questionText: "A preprocesszor eszköztárából melyik kulcsszóval hozhatunk létre makrókat és szimbolikus konstansokat a C nyelvben?",
        options: ["const", "#include", "#define", "macro"],
        correctAnswerIndex: 2
      }
    ]
  },
  {
    weekNumber: 13,
    title: "13. Hét: Láncolt Listák",
    description: "Dinamikus adatszerkezetek és pointerek összekapcsolása.",
    difficulty: "hard",
    questions: [
      {
        questionText: "Mit tartalmaz egy egyszerűen láncolt lista (Linked List) legutolsó csomópontjának mutatója (next pointer)?",
        options: [
          "A saját memóriacímét",
          "A lista fejét (head)",
          "NULL értéket",
          "A teljes memóriaterület méretét"
        ],
        correctAnswerIndex: 2
      }
    ]
  },
  {
    weekNumber: 14,
    title: "14. Hét: Szemeszter Összefoglalás",
    description: "Végső ellenőrzés a C programozásból.",
    difficulty: "medium",
    questions: [
      {
        questionText: "Mi a szabványos belépési pontja (főfüggvénye) egy C programnak, ahonnan az operációs rendszer elindítja a végrehajtást?",
        options: ["start()", "init()", "main()", "run()"],
        correctAnswerIndex: 2
      }
    ]
  }
];

// ITT VAN A LOGIKA:
const seedQuizzes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Sikeres adatbázis kapcsolat!');

    const teacher = await User.findOne({ role: 'teacher' });
    if (!teacher) {
      console.log('❌ Nincs tanár az adatbázisban!');
      process.exit(1);
    }

    console.log(`👨‍🏫 Kijelölt tanár a kvízekhez: ${teacher.username}`);

    // Tiszta lap: Törlünk mindent a Kvízekből ÉS a Kérdésekből is
    await Quiz.deleteMany({ title: { $regex: 'Hét:' } });
    await Question.deleteMany({}); 
    console.log('🗑️ Korábbi teszt adatok törölve.');

    // Kvízek és Kérdések mentése külön-külön
    for (const quizItem of quizzesData) {
      // 1. Kvíz mentése (kérdések nélkül)
      const newQuiz = new Quiz({
        weekNumber: quizItem.weekNumber,
        title: quizItem.title,
        description: quizItem.description,
        difficulty: quizItem.difficulty,
        teacherId: teacher._id
      });
      const savedQuiz = await newQuiz.save();

      // 2. Kérdések mentése a savedQuiz._id-val összekötve
      const questionsToInsert = quizItem.questions.map(q => ({
        quizId: savedQuiz._id,
        questionText: q.questionText,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex
      }));

      await Question.insertMany(questionsToInsert);
      console.log(`📍 ${quizItem.title} feltöltve (${questionsToInsert.length} kérdéssel).`);
    }

    console.log('🚀 SIKER! Minden kvíz és kérdés szétválogatva feltöltve!');

  } catch (err) {
    console.error('❌ Hiba történt:', err);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

seedQuizzes();