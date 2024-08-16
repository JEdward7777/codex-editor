export interface BookData {
    [book: string]: {
        chapterCount: number,
        chapterVerseCountPairings: {
            [chapter: string]: number
        },
        name?: string,
        abbr?: string,
        ord?: string,
        book_group_id?: string,
        testament?: string,
        language_direction?: string,
        id?: string,
        usfm_end?: string,
        next?: {
            book?: {
                name?: string,
                id?: string
            }
        },
        previous?: {
            book?: {
                name?: string,
                id?: string
            }
        },
        abbreviations?: string[],
    }
}

export function getLookupStringsForBook(book: string) {
    const bookData = vrefData[book];
    if (!bookData) {
        return [];
    }

    const lookupStrings = [
        bookData.name,
        bookData.abbr,
    ];

    if (bookData.abbreviations) {
        lookupStrings.push(...bookData.abbreviations);
    }

    return lookupStrings;
}

export function validateVrefAgainstORG(vref: string) {
    const [book, chapter, verse] = vref.split(" ");
    if (!book || !chapter || !verse) {
        return false;
    }
    if (!vrefData[book]) {
        return false;
    }
    if (!vrefData[book].chapterVerseCountPairings[chapter]) {
        return false;
    }
    if (vrefData[book].chapterVerseCountPairings[chapter] < parseInt(verse)) {
        return false;
    }
    return true;
}

export const nonCanonicalBookRefs: string[] = [
    "TOB",
    "JDT",
    "ESG",
    "WIS",
    "SIR",
    "BAR",
    "LJE",
    "S3Y",
    "SUS",
    "BEL",
    "1MA",
    "2MA",
    "3MA",
    "4MA",
    "1ES",
    "2ES",
    "MAN",
    "PS2",
    "ODA",
    "PSS",
    "EZA",
    "5EZ",
    "6EZ",
    "DAG",
    "PS3",
    "2BA",
    "LBA",
    "JUB",
    "ENO",
    "1MQ",
    "2MQ",
    "3MQ",
    "REP",
    "4BA",
    "LAO",
    "FRT",
    "BAK",
    "OTH",
    "INT",
    "CNC",
    "GLO",
    "TDX",
    "NDX",
    "XXA",
    "XXB",
    "XXC",
    "XXD",
    "XXE",
    "XXF",
    "100",
    "XXG",
];

interface NonCanonicalBookData {
    [book: string]: {
        chapterCount: number,
        chapterVerseCountPairings: {
            [chapter: string]: number
        }
    }
}

export const nonCanonicalVrefData: NonCanonicalBookData = {
    "TOB": {
        "chapterCount": 14,
        "chapterVerseCountPairings": {
            "1": 22,
            "2": 14,
            "3": 17,
            "4": 21,
            "5": 23,
            "6": 19,
            "7": 17,
            "8": 21,
            "9": 6,
            "10": 14,
            "11": 19,
            "12": 22,
            "13": 18,
            "14": 15
        }
    },
    "JDT": {
        "chapterCount": 16,
        "chapterVerseCountPairings": {
            "1": 16,
            "2": 28,
            "3": 10,
            "4": 15,
            "5": 24,
            "6": 21,
            "7": 32,
            "8": 36,
            "9": 14,
            "10": 23,
            "11": 23,
            "12": 20,
            "13": 20,
            "14": 19,
            "15": 14,
            "16": 25
        }
    },
    "ESG": {
        "chapterCount": 10,
        "chapterVerseCountPairings": {
            "1": 39,
            "2": 23,
            "3": 22,
            "4": 47,
            "5": 28,
            "6": 14,
            "7": 10,
            "8": 41,
            "9": 32,
            "10": 14
        }
    },
    "WIS": {
        "chapterCount": 19,
        "chapterVerseCountPairings": {
            "1": 16,
            "2": 24,
            "3": 19,
            "4": 20,
            "5": 23,
            "6": 25,
            "7": 30,
            "8": 21,
            "9": 18,
            "10": 21,
            "11": 26,
            "12": 27,
            "13": 19,
            "14": 31,
            "15": 19,
            "16": 29,
            "17": 20,
            "18": 25,
            "19": 22
        }
    },
    "SIR": {
        "chapterCount": 51,
        "chapterVerseCountPairings": {
            "1": 30,
            "2": 18,
            "3": 31,
            "4": 31,
            "5": 15,
            "6": 37,
            "7": 36,
            "8": 19,
            "9": 18,
            "10": 31,
            "11": 34,
            "12": 18,
            "13": 26,
            "14": 27,
            "15": 20,
            "16": 30,
            "17": 32,
            "18": 33,
            "19": 30,
            "20": 31,
            "21": 28,
            "22": 27,
            "23": 27,
            "24": 34,
            "25": 26,
            "26": 29,
            "27": 30,
            "28": 26,
            "29": 28,
            "30": 25,
            "31": 31,
            "32": 24,
            "33": 33,
            "34": 26,
            "35": 24,
            "36": 27,
            "37": 31,
            "38": 34,
            "39": 35,
            "40": 30,
            "41": 27,
            "42": 25,
            "43": 33,
            "44": 23,
            "45": 26,
            "46": 20,
            "47": 25,
            "48": 25,
            "49": 16,
            "50": 29,
            "51": 30
        }
    },
    "BAR": {
        "chapterCount": 5,
        "chapterVerseCountPairings": {
            "1": 22,
            "2": 35,
            "3": 38,
            "4": 37,
            "5": 9
        }
    },
    "LJE": {
        "chapterCount": 1,
        "chapterVerseCountPairings": {
            "1": 72
        }
    },
    "S3Y": {
        "chapterCount": 1,
        "chapterVerseCountPairings": {
            "1": 67
        }
    },
    "SUS": {
        "chapterCount": 1,
        "chapterVerseCountPairings": {
            "1": 64
        }
    },
    "BEL": {
        "chapterCount": 1,
        "chapterVerseCountPairings": {
            "1": 42
        }
    },
    "1MA": {
        "chapterCount": 16,
        "chapterVerseCountPairings": {
            "1": 64,
            "2": 70,
            "3": 60,
            "4": 61,
            "5": 68,
            "6": 63,
            "7": 50,
            "8": 32,
            "9": 73,
            "10": 89,
            "11": 74,
            "12": 53,
            "13": 53,
            "14": 49,
            "15": 41,
            "16": 24
        }
    },
    "2MA": {
        "chapterCount": 15,
        "chapterVerseCountPairings": {
            "1": 36,
            "2": 32,
            "3": 40,
            "4": 50,
            "5": 27,
            "6": 31,
            "7": 42,
            "8": 36,
            "9": 29,
            "10": 38,
            "11": 38,
            "12": 45,
            "13": 26,
            "14": 46,
            "15": 39
        }
    },
    "3MA": {
        "chapterCount": 7,
        "chapterVerseCountPairings": {
            "1": 29,
            "2": 33,
            "3": 30,
            "4": 21,
            "5": 51,
            "6": 41,
            "7": 23
        }
    },
    "4MA": {
        "chapterCount": 18,
        "chapterVerseCountPairings": {
            "1": 35,
            "2": 24,
            "3": 21,
            "4": 26,
            "5": 38,
            "6": 35,
            "7": 23,
            "8": 29,
            "9": 32,
            "10": 21,
            "11": 27,
            "12": 19,
            "13": 27,
            "14": 20,
            "15": 32,
            "16": 25,
            "17": 24,
            "18": 24
        }
    },
    "1ES": {
        "chapterCount": 9,
        "chapterVerseCountPairings": {
            "1": 55,
            "2": 26,
            "3": 24,
            "4": 63,
            "5": 71,
            "6": 33,
            "7": 15,
            "8": 92,
            "9": 55
        }
    },
    "2ES": {
        "chapterCount": 16,
        "chapterVerseCountPairings": {
            "1": 40,
            "2": 48,
            "3": 36,
            "4": 52,
            "5": 56,
            "6": 59,
            "7": 140,
            "8": 63,
            "9": 47,
            "10": 59,
            "11": 46,
            "12": 51,
            "13": 58,
            "14": 48,
            "15": 63,
            "16": 78
        }
    },
    "MAN": {
        "chapterCount": 1,
        "chapterVerseCountPairings": {
            "1": 15
        }
    },
    "PS2": {
        "chapterCount": 1,
        "chapterVerseCountPairings": {
            "1": 7
        }
    },
    "ODA": {
        "chapterCount": 14,
        "chapterVerseCountPairings": {
            "1": 19,
            "2": 43,
            "3": 10,
            "4": 19,
            "5": 12,
            "6": 8,
            "7": 20,
            "8": 37,
            "9": 22,
            "10": 9,
            "11": 11,
            "12": 15,
            "13": 4,
            "14": 46
        }
    },
    "PSS": {
        "chapterCount": 18,
        "chapterVerseCountPairings": {
            "1": 8,
            "2": 37,
            "3": 12,
            "4": 25,
            "5": 19,
            "6": 6,
            "7": 10,
            "8": 34,
            "9": 11,
            "10": 8,
            "11": 9,
            "12": 6,
            "13": 12,
            "14": 10,
            "15": 13,
            "16": 15,
            "17": 46,
            "18": 12
        }
    },
    "EZA": {
        "chapterCount": 12,
        "chapterVerseCountPairings": {
            "1": 36,
            "2": 52,
            "3": 56,
            "4": 59,
            "5": 139,
            "6": 63,
            "7": 47,
            "8": 60,
            "9": 46,
            "10": 51,
            "11": 58,
            "12": 48
        }
    },
    "JUB": {
        "chapterCount": 34,
        "chapterVerseCountPairings": {
            "1": 26,
            "2": 17,
            "3": 19,
            "4": 24,
            "5": 36,
            "6": 34,
            "7": 37,
            "8": 40,
            "9": 27,
            "10": 48,
            "11": 39,
            "12": 56,
            "13": 34,
            "14": 55,
            "15": 20,
            "16": 28,
            "17": 30,
            "18": 31,
            "19": 59,
            "20": 66,
            "21": 30,
            "22": 38,
            "23": 59,
            "24": 30,
            "25": 50,
            "26": 48,
            "27": 37,
            "28": 38,
            "29": 27,
            "30": 29,
            "31": 31,
            "32": 24,
            "33": 30,
            "34": 20
        }
    },
    "ENO": {
        "chapterCount": 42,
        "chapterVerseCountPairings": {
            "1": 28,
            "2": 42,
            "3": 30,
            "4": 88,
            "5": 40,
            "6": 42,
            "7": 39,
            "8": 46,
            "9": 42,
            "10": 16,
            "11": 19,
            "12": 40,
            "13": 34,
            "14": 35,
            "15": 45,
            "16": 41,
            "17": 69,
            "18": 42,
            "19": 29,
            "20": 53,
            "21": 57,
            "22": 14,
            "23": 26,
            "24": 16,
            "25": 30,
            "26": 37,
            "27": 21,
            "28": 34,
            "29": 28,
            "30": 23,
            "31": 29,
            "32": 82,
            "33": 59,
            "34": 49,
            "35": 36,
            "36": 30,
            "37": 34,
            "38": 36,
            "39": 24,
            "40": 40,
            "41": 22,
            "42": 16
        }
    }
};

export const vrefData: BookData = {
    "GEN": {
        "chapterCount": 50,
        "chapterVerseCountPairings": {
            "1": 31,
            "2": 25,
            "3": 24,
            "4": 26,
            "5": 32,
            "6": 22,
            "7": 24,
            "8": 22,
            "9": 29,
            "10": 32,
            "11": 32,
            "12": 20,
            "13": 18,
            "14": 24,
            "15": 21,
            "16": 16,
            "17": 27,
            "18": 33,
            "19": 38,
            "20": 18,
            "21": 34,
            "22": 24,
            "23": 20,
            "24": 67,
            "25": 34,
            "26": 35,
            "27": 46,
            "28": 22,
            "29": 35,
            "30": 43,
            "31": 54,
            "32": 33,
            "33": 20,
            "34": 31,
            "35": 29,
            "36": 43,
            "37": 36,
            "38": 30,
            "39": 23,
            "40": 23,
            "41": 57,
            "42": 38,
            "43": 34,
            "44": 34,
            "45": 28,
            "46": 34,
            "47": 31,
            "48": 22,
            "49": 33,
            "50": 26
        },
        "name": "Genesis",
        "abbr": "GEN",
        "ord": "01",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Gen",
        "usfm_end": "GEN 50:26",
        "next": {
            "book": {
                "name": "Exodus",
                "id": "Exod"
            }
        },
        "abbreviations": [
            "Gen.",
            "Ge.",
            "Gn."
        ]
    },
    "EXO": {
        "chapterCount": 40,
        "chapterVerseCountPairings": {
            "1": 22,
            "2": 25,
            "3": 22,
            "4": 31,
            "5": 23,
            "6": 30,
            "7": 29,
            "8": 28,
            "9": 35,
            "10": 29,
            "11": 10,
            "12": 51,
            "13": 22,
            "14": 31,
            "15": 27,
            "16": 36,
            "17": 16,
            "18": 27,
            "19": 25,
            "20": 26,
            "21": 37,
            "22": 30,
            "23": 33,
            "24": 18,
            "25": 40,
            "26": 37,
            "27": 21,
            "28": 43,
            "29": 46,
            "30": 38,
            "31": 18,
            "32": 35,
            "33": 23,
            "34": 35,
            "35": 35,
            "36": 38,
            "37": 29,
            "38": 31,
            "39": 43,
            "40": 38
        },
        "name": "Exodus",
        "abbr": "EXO",
        "ord": "02",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Exod",
        "usfm_end": "EXO 40:38",
        "next": {
            "book": {
                "name": "Leviticus",
                "id": "Lev"
            }
        },
        "previous": {
            "book": {
                "name": "Genesis",
                "id": "Gen"
            }
        },
        "abbreviations": [
            "Ex.",
            "Exod.",
            "Exo."
        ]
    },
    "LEV": {
        "chapterCount": 27,
        "chapterVerseCountPairings": {
            "1": 17,
            "2": 16,
            "3": 17,
            "4": 35,
            "5": 26,
            "6": 23,
            "7": 38,
            "8": 36,
            "9": 24,
            "10": 20,
            "11": 47,
            "12": 8,
            "13": 59,
            "14": 57,
            "15": 33,
            "16": 34,
            "17": 16,
            "18": 30,
            "19": 37,
            "20": 27,
            "21": 24,
            "22": 33,
            "23": 44,
            "24": 23,
            "25": 55,
            "26": 46,
            "27": 34
        },
        "name": "Leviticus",
        "abbr": "LEV",
        "ord": "03",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Lev",
        "usfm_end": "LEV 27:34",
        "next": {
            "book": {
                "name": "Numbers",
                "id": "Num"
            }
        },
        "previous": {
            "book": {
                "name": "Exodus",
                "id": "Exod"
            }
        },
        "abbreviations": [
            "Lev.",
            "Le.",
            "Lv."
        ]
    },
    "NUM": {
        "chapterCount": 36,
        "chapterVerseCountPairings": {
            "1": 54,
            "2": 34,
            "3": 51,
            "4": 49,
            "5": 31,
            "6": 27,
            "7": 89,
            "8": 26,
            "9": 23,
            "10": 36,
            "11": 35,
            "12": 16,
            "13": 33,
            "14": 45,
            "15": 41,
            "16": 35,
            "17": 28,
            "18": 32,
            "19": 22,
            "20": 29,
            "21": 35,
            "22": 41,
            "23": 30,
            "24": 25,
            "25": 19,
            "26": 65,
            "27": 23,
            "28": 31,
            "29": 39,
            "30": 17,
            "31": 54,
            "32": 42,
            "33": 56,
            "34": 29,
            "35": 34,
            "36": 13
        },
        "name": "Numbers",
        "abbr": "NUM",
        "ord": "04",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Num",
        "usfm_end": "NUM 36:13",
        "next": {
            "book": {
                "name": "Deuteronomy",
                "id": "Deut"
            }
        },
        "previous": {
            "book": {
                "name": "Leviticus",
                "id": "Lev"
            }
        },
        "abbreviations": [
            "Num.",
            "Nu.",
            "Nm.",
            "Nb."
        ]
    },
    "DEU": {
        "chapterCount": 34,
        "chapterVerseCountPairings": {
            "1": 46,
            "2": 37,
            "3": 29,
            "4": 49,
            "5": 33,
            "6": 25,
            "7": 26,
            "8": 20,
            "9": 29,
            "10": 22,
            "11": 32,
            "12": 31,
            "13": 19,
            "14": 29,
            "15": 23,
            "16": 22,
            "17": 20,
            "18": 22,
            "19": 21,
            "20": 20,
            "21": 23,
            "22": 29,
            "23": 26,
            "24": 22,
            "25": 19,
            "26": 19,
            "27": 26,
            "28": 69,
            "29": 28,
            "30": 20,
            "31": 30,
            "32": 52,
            "33": 29,
            "34": 12
        },
        "name": "Deuteronomy",
        "abbr": "DEU",
        "ord": "05",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Deut",
        "usfm_end": "DEU 34:12",
        "next": {
            "book": {
                "name": "Joshua",
                "id": "Josh"
            }
        },
        "previous": {
            "book": {
                "name": "Numbers",
                "id": "Num"
            }
        },
        "abbreviations": [
            "Deut.",
            "De.",
            "Dt."
        ]
    },
    "JOS": {
        "chapterCount": 24,
        "chapterVerseCountPairings": {
            "1": 18,
            "2": 24,
            "3": 17,
            "4": 24,
            "5": 15,
            "6": 27,
            "7": 26,
            "8": 35,
            "9": 27,
            "10": 43,
            "11": 23,
            "12": 24,
            "13": 33,
            "14": 15,
            "15": 63,
            "16": 10,
            "17": 18,
            "18": 28,
            "19": 51,
            "20": 9,
            "21": 45,
            "22": 34,
            "23": 16,
            "24": 33
        },
        "name": "Joshua",
        "abbr": "JOS",
        "ord": "06",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Josh",
        "usfm_end": "JOS 24:33",
        "next": {
            "book": {
                "name": "Judges",
                "id": "Judg"
            }
        },
        "previous": {
            "book": {
                "name": "Deuteronomy",
                "id": "Deut"
            }
        },
        "abbreviations": [
            "Josh.",
            "Jos.",
            "Jsh."
        ]
    },
    "JDG": {
        "chapterCount": 21,
        "chapterVerseCountPairings": {
            "1": 36,
            "2": 23,
            "3": 31,
            "4": 24,
            "5": 31,
            "6": 40,
            "7": 25,
            "8": 35,
            "9": 57,
            "10": 18,
            "11": 40,
            "12": 15,
            "13": 25,
            "14": 20,
            "15": 20,
            "16": 31,
            "17": 13,
            "18": 31,
            "19": 30,
            "20": 48,
            "21": 25
        },
        "name": "Judges",
        "abbr": "JDG",
        "ord": "07",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Judg",
        "usfm_end": "JDG 21:25",
        "next": {
            "book": {
                "name": "Ruth",
                "id": "Ruth"
            }
        },
        "previous": {
            "book": {
                "name": "Joshua",
                "id": "Josh"
            }
        },
        "abbreviations": [
            "Judg.",
            "Jdg.",
            "Jg.",
            "Jdgs."
        ]
    },
    "RUT": {
        "chapterCount": 4,
        "chapterVerseCountPairings": {
            "1": 22,
            "2": 23,
            "3": 18,
            "4": 22
        },
        "name": "Ruth",
        "abbr": "RUT",
        "ord": "08",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Ruth",
        "usfm_end": "RUT 4:22",
        "next": {
            "book": {
                "name": "1 Samuel",
                "id": "1Sam"
            }
        },
        "previous": {
            "book": {
                "name": "Judges",
                "id": "Judg"
            }
        },
        "abbreviations": [
            "Ruth",
            "Rth.",
            "Ru."
        ]
    },
    "1SA": {
        "chapterCount": 31,
        "chapterVerseCountPairings": {
            "1": 28,
            "2": 36,
            "3": 21,
            "4": 22,
            "5": 12,
            "6": 21,
            "7": 17,
            "8": 22,
            "9": 27,
            "10": 27,
            "11": 15,
            "12": 25,
            "13": 23,
            "14": 52,
            "15": 35,
            "16": 23,
            "17": 58,
            "18": 30,
            "19": 24,
            "20": 42,
            "21": 16,
            "22": 23,
            "23": 28,
            "24": 23,
            "25": 44,
            "26": 25,
            "27": 12,
            "28": 25,
            "29": 11,
            "30": 31,
            "31": 13
        },
        "name": "1 Samuel",
        "abbr": "1SA",
        "ord": "09",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "1Sam",
        "usfm_end": "1SA 31:13",
        "next": {
            "book": {
                "name": "2 Samuel",
                "id": "2Sam"
            }
        },
        "previous": {
            "book": {
                "name": "Ruth",
                "id": "Ruth"
            }
        },
        "abbreviations": [
            "1 Sam.",
            "1 Sm.",
            "1 Sa.",
            "1 S.",
            "I Sam.",
            "I Sa.",
            "1Sam.",
            "1Sa.",
            "1S.",
            "1st Samuel",
            "1st Sam.",
            "First Samuel",
            "First Sam."
        ]
    },
    "2SA": {
        "chapterCount": 24,
        "chapterVerseCountPairings": {
            "1": 27,
            "2": 32,
            "3": 39,
            "4": 12,
            "5": 25,
            "6": 23,
            "7": 29,
            "8": 18,
            "9": 13,
            "10": 19,
            "11": 27,
            "12": 31,
            "13": 39,
            "14": 33,
            "15": 37,
            "16": 23,
            "17": 29,
            "18": 32,
            "19": 44,
            "20": 26,
            "21": 22,
            "22": 51,
            "23": 39,
            "24": 25
        },
        "name": "2 Samuel",
        "abbr": "2SA",
        "ord": "10",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "2Sam",
        "usfm_end": "2SA 24:25",
        "next": {
            "book": {
                "name": "1 Kings",
                "id": "1Kgs"
            }
        },
        "previous": {
            "book": {
                "name": "1 Samuel",
                "id": "1Sam"
            }
        },
        "abbreviations": [
            "2 Sam.",
            "2 Sm.",
            "2 Sa.",
            "2 S.",
            "II Sam.",
            "II Sa.",
            "2Sam.",
            "2Sa.",
            "2S.",
            "2nd Samuel",
            "2nd Sam.",
            "Second Samuel",
            "Second Sam."
        ]
    },
    "1KI": {
        "chapterCount": 22,
        "chapterVerseCountPairings": {
            "1": 53,
            "2": 46,
            "3": 28,
            "4": 20,
            "5": 32,
            "6": 38,
            "7": 51,
            "8": 66,
            "9": 28,
            "10": 29,
            "11": 43,
            "12": 33,
            "13": 34,
            "14": 31,
            "15": 34,
            "16": 34,
            "17": 24,
            "18": 46,
            "19": 21,
            "20": 43,
            "21": 29,
            "22": 54
        },
        "name": "1 Kings",
        "abbr": "1KI",
        "ord": "11",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "1Kgs",
        "usfm_end": "1KI 22:53",
        "next": {
            "book": {
                "name": "2 Kings",
                "id": "2Kgs"
            }
        },
        "previous": {
            "book": {
                "name": "2 Samuel",
                "id": "2Sam"
            }
        },
        "abbreviations": [
            "1 Kings",
            "1 Kgs",
            "1 Ki",
            "1Kgs",
            "1Kin",
            "1Ki",
            "1K",
            "I Kgs",
            "I Ki",
            "1st Kings",
            "1st Kgs",
            "First Kings",
            "First Kgs"
        ]
    },
    "2KI": {
        "chapterCount": 25,
        "chapterVerseCountPairings": {
            "1": 18,
            "2": 25,
            "3": 27,
            "4": 44,
            "5": 27,
            "6": 33,
            "7": 20,
            "8": 29,
            "9": 37,
            "10": 36,
            "11": 20,
            "12": 22,
            "13": 25,
            "14": 29,
            "15": 38,
            "16": 20,
            "17": 41,
            "18": 37,
            "19": 37,
            "20": 21,
            "21": 26,
            "22": 20,
            "23": 37,
            "24": 20,
            "25": 30
        },
        "name": "2 Kings",
        "abbr": "2KI",
        "ord": "12",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "2Kgs",
        "usfm_end": "2KI 25:30",
        "next": {
            "book": {
                "name": "1 Chronicles",
                "id": "1Chr"
            }
        },
        "previous": {
            "book": {
                "name": "1 Kings",
                "id": "1Kgs"
            }
        },
        "abbreviations": [
            "2 Kings",
            "2 Kgs.",
            "2 Ki.",
            "2Kgs.",
            "2Kin.",
            "2Ki.",
            "2K.",
            "II Kgs.",
            "II Ki.",
            "2nd Kings",
            "2nd Kgs.",
            "Second Kings",
            "Second Kgs."
        ]
    },
    "1CH": {
        "chapterCount": 29,
        "chapterVerseCountPairings": {
            "1": 54,
            "2": 55,
            "3": 24,
            "4": 43,
            "5": 41,
            "6": 66,
            "7": 40,
            "8": 40,
            "9": 44,
            "10": 14,
            "11": 47,
            "12": 41,
            "13": 14,
            "14": 17,
            "15": 29,
            "16": 43,
            "17": 27,
            "18": 17,
            "19": 19,
            "20": 8,
            "21": 30,
            "22": 19,
            "23": 32,
            "24": 31,
            "25": 31,
            "26": 32,
            "27": 34,
            "28": 21,
            "29": 30
        },
        "name": "1 Chronicles",
        "abbr": "1CH",
        "ord": "13",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "1Chr",
        "usfm_end": "1CH 29:30",
        "next": {
            "book": {
                "name": "2 Chronicles",
                "id": "2Chr"
            }
        },
        "previous": {
            "book": {
                "name": "2 Kings",
                "id": "2Kgs"
            }
        },
        "abbreviations": [
            "1 Chron.",
            "1 Chr.",
            "1 Ch.",
            "1Chron.",
            "1Chr.",
            "1Ch.",
            "I Chron.",
            "I Chr.",
            "I Ch.",
            "1st Chronicles",
            "1st Chron.",
            "First Chronicles",
            "First Chron."
        ]
    },
    "2CH": {
        "chapterCount": 36,
        "chapterVerseCountPairings": {
            "1": 18,
            "2": 17,
            "3": 17,
            "4": 22,
            "5": 14,
            "6": 42,
            "7": 22,
            "8": 18,
            "9": 31,
            "10": 19,
            "11": 23,
            "12": 16,
            "13": 23,
            "14": 14,
            "15": 19,
            "16": 14,
            "17": 19,
            "18": 34,
            "19": 11,
            "20": 37,
            "21": 20,
            "22": 12,
            "23": 21,
            "24": 27,
            "25": 28,
            "26": 23,
            "27": 9,
            "28": 27,
            "29": 36,
            "30": 27,
            "31": 21,
            "32": 33,
            "33": 25,
            "34": 33,
            "35": 27,
            "36": 23
        },
        "name": "2 Chronicles",
        "abbr": "2CH",
        "ord": "14",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "2Chr",
        "usfm_end": "2CH 36:23",
        "next": {
            "book": {
                "name": "Ezra",
                "id": "Ezra"
            }
        },
        "previous": {
            "book": {
                "name": "1 Chronicles",
                "id": "1Chr"
            }
        },
        "abbreviations": [
            "2 Chron.",
            "2 Chr.",
            "2 Ch.",
            "2Chron.",
            "2Chr.",
            "2Ch.",
            "II Chron.",
            "II Chr.",
            "II Ch.",
            "2nd Chronicles",
            "2nd Chron.",
            "Second Chronicles",
            "Second Chron."
        ]
    },
    "EZR": {
        "chapterCount": 10,
        "chapterVerseCountPairings": {
            "1": 11,
            "2": 70,
            "3": 13,
            "4": 24,
            "5": 17,
            "6": 22,
            "7": 28,
            "8": 36,
            "9": 15,
            "10": 44
        },
        "name": "Ezra",
        "abbr": "EZR",
        "ord": "15",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Ezra",
        "usfm_end": "EZR 10:44",
        "next": {
            "book": {
                "name": "Nehemiah",
                "id": "Neh"
            }
        },
        "previous": {
            "book": {
                "name": "2 Chronicles",
                "id": "2Chr"
            }
        },
        "abbreviations": [
            "Ezra",
            "Ezr.",
            "Ez."
        ]
    },
    "NEH": {
        "chapterCount": 13,
        "chapterVerseCountPairings": {
            "1": 11,
            "2": 20,
            "3": 38,
            "4": 17,
            "5": 19,
            "6": 19,
            "7": 72,
            "8": 18,
            "9": 37,
            "10": 40,
            "11": 36,
            "12": 47,
            "13": 31
        },
        "name": "Nehemiah",
        "abbr": "NEH",
        "ord": "16",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Neh",
        "usfm_end": "NEH 13:31",
        "next": {
            "book": {
                "name": "Esther",
                "id": "Esth"
            }
        },
        "previous": {
            "book": {
                "name": "Ezra",
                "id": "Ezra"
            }
        },
        "abbreviations": [
            "Neh.",
            "Ne."
        ]
    },
    "EST": {
        "chapterCount": 10,
        "chapterVerseCountPairings": {
            "1": 22,
            "2": 23,
            "3": 15,
            "4": 17,
            "5": 14,
            "6": 14,
            "7": 10,
            "8": 17,
            "9": 32,
            "10": 3
        },
        "name": "Esther",
        "abbr": "EST",
        "ord": "17",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Esth",
        "usfm_end": "EST 10:3",
        "next": {
            "book": {
                "name": "Job",
                "id": "Job"
            }
        },
        "previous": {
            "book": {
                "name": "Nehemiah",
                "id": "Neh"
            }
        },
        "abbreviations": [
            "Est.",
            "Esth.",
            "Es."
        ]
    },
    "JOB": {
        "chapterCount": 42,
        "chapterVerseCountPairings": {
            "1": 22,
            "2": 13,
            "3": 26,
            "4": 21,
            "5": 27,
            "6": 30,
            "7": 21,
            "8": 22,
            "9": 35,
            "10": 22,
            "11": 20,
            "12": 25,
            "13": 28,
            "14": 22,
            "15": 35,
            "16": 22,
            "17": 16,
            "18": 21,
            "19": 29,
            "20": 29,
            "21": 34,
            "22": 30,
            "23": 17,
            "24": 25,
            "25": 6,
            "26": 14,
            "27": 23,
            "28": 28,
            "29": 25,
            "30": 31,
            "31": 40,
            "32": 22,
            "33": 33,
            "34": 37,
            "35": 16,
            "36": 33,
            "37": 24,
            "38": 41,
            "39": 30,
            "40": 32,
            "41": 26,
            "42": 17
        },
        "name": "Job",
        "abbr": "JOB",
        "ord": "18",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Job",
        "usfm_end": "JOB 42:17",
        "next": {
            "book": {
                "name": "Psalms",
                "id": "Ps"
            }
        },
        "previous": {
            "book": {
                "name": "Esther",
                "id": "Esth"
            }
        },
        "abbreviations": [
            "Job",
            "Jb."
        ]
    },
    "PSA": {
        "chapterCount": 150,
        "chapterVerseCountPairings": {
            "1": 6,
            "2": 12,
            "3": 9,
            "4": 9,
            "5": 13,
            "6": 11,
            "7": 18,
            "8": 10,
            "9": 21,
            "10": 18,
            "11": 7,
            "12": 9,
            "13": 6,
            "14": 7,
            "15": 5,
            "16": 11,
            "17": 15,
            "18": 51,
            "19": 15,
            "20": 10,
            "21": 14,
            "22": 32,
            "23": 6,
            "24": 10,
            "25": 22,
            "26": 12,
            "27": 14,
            "28": 9,
            "29": 11,
            "30": 13,
            "31": 25,
            "32": 11,
            "33": 22,
            "34": 23,
            "35": 28,
            "36": 13,
            "37": 40,
            "38": 23,
            "39": 14,
            "40": 18,
            "41": 14,
            "42": 12,
            "43": 5,
            "44": 27,
            "45": 18,
            "46": 12,
            "47": 10,
            "48": 15,
            "49": 21,
            "50": 23,
            "51": 21,
            "52": 11,
            "53": 7,
            "54": 9,
            "55": 24,
            "56": 14,
            "57": 12,
            "58": 12,
            "59": 18,
            "60": 14,
            "61": 9,
            "62": 13,
            "63": 12,
            "64": 11,
            "65": 14,
            "66": 20,
            "67": 8,
            "68": 36,
            "69": 37,
            "70": 6,
            "71": 24,
            "72": 20,
            "73": 28,
            "74": 23,
            "75": 11,
            "76": 13,
            "77": 21,
            "78": 72,
            "79": 13,
            "80": 20,
            "81": 17,
            "82": 8,
            "83": 19,
            "84": 13,
            "85": 14,
            "86": 17,
            "87": 7,
            "88": 19,
            "89": 53,
            "90": 17,
            "91": 16,
            "92": 16,
            "93": 5,
            "94": 23,
            "95": 11,
            "96": 13,
            "97": 12,
            "98": 9,
            "99": 9,
            "100": 5,
            "101": 8,
            "102": 29,
            "103": 22,
            "104": 35,
            "105": 45,
            "106": 48,
            "107": 43,
            "108": 14,
            "109": 31,
            "110": 7,
            "111": 10,
            "112": 10,
            "113": 9,
            "114": 8,
            "115": 18,
            "116": 19,
            "117": 2,
            "118": 29,
            "119": 176,
            "120": 7,
            "121": 8,
            "122": 9,
            "123": 4,
            "124": 8,
            "125": 5,
            "126": 6,
            "127": 5,
            "128": 6,
            "129": 8,
            "130": 8,
            "131": 3,
            "132": 18,
            "133": 3,
            "134": 3,
            "135": 21,
            "136": 26,
            "137": 9,
            "138": 8,
            "139": 24,
            "140": 14,
            "141": 10,
            "142": 8,
            "143": 12,
            "144": 15,
            "145": 21,
            "146": 10,
            "147": 20,
            "148": 14,
            "149": 9,
            "150": 6
        },
        "name": "Psalms",
        "abbr": "PSA",
        "ord": "19",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Ps",
        "usfm_end": "PSA 150:6",
        "next": {
            "book": {
                "name": "Proverbs",
                "id": "Prov"
            }
        },
        "previous": {
            "book": {
                "name": "Job",
                "id": "Job"
            }
        },
        "abbreviations": [
            "Ps.",
            "Psalm",
            "Pslm.",
            "Psa.",
            "Psm.",
            "Pss."
        ]
    },
    "PRO": {
        "chapterCount": 31,
        "chapterVerseCountPairings": {
            "1": 33,
            "2": 22,
            "3": 35,
            "4": 27,
            "5": 23,
            "6": 35,
            "7": 27,
            "8": 36,
            "9": 18,
            "10": 32,
            "11": 31,
            "12": 28,
            "13": 25,
            "14": 35,
            "15": 33,
            "16": 33,
            "17": 28,
            "18": 24,
            "19": 29,
            "20": 30,
            "21": 31,
            "22": 29,
            "23": 35,
            "24": 34,
            "25": 28,
            "26": 28,
            "27": 27,
            "28": 28,
            "29": 27,
            "30": 33,
            "31": 31
        },
        "name": "Proverbs",
        "abbr": "PRO",
        "ord": "20",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Prov",
        "usfm_end": "PRO 31:31",
        "next": {
            "book": {
                "name": "Ecclesiastes",
                "id": "Eccl"
            }
        },
        "previous": {
            "book": {
                "name": "Psalms",
                "id": "Ps"
            }
        },
        "abbreviations": [
            "Prov",
            "Pro.",
            "Prv.",
            "Pr."
        ]
    },
    "ECC": {
        "chapterCount": 12,
        "chapterVerseCountPairings": {
            "1": 18,
            "2": 26,
            "3": 22,
            "4": 17,
            "5": 19,
            "6": 12,
            "7": 29,
            "8": 17,
            "9": 18,
            "10": 20,
            "11": 10,
            "12": 14
        },
        "name": "Ecclesiastes",
        "abbr": "ECC",
        "ord": "21",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Eccl",
        "usfm_end": "ECC 12:14",
        "next": {
            "book": {
                "name": "Song of Solomon",
                "id": "Song"
            }
        },
        "previous": {
            "book": {
                "name": "Proverbs",
                "id": "Prov"
            }
        },
        "abbreviations": [
            "Eccles.",
            "Eccle.",
            "Ecc.",
            "Ec.",
            "Qoh."
        ]
    },
    "SNG": {
        "chapterCount": 8,
        "chapterVerseCountPairings": {
            "1": 17,
            "2": 17,
            "3": 11,
            "4": 16,
            "5": 16,
            "6": 12,
            "7": 14,
            "8": 14
        },
        "name": "Song of Solomon",
        "abbr": "SNG",
        "ord": "22",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Song",
        "usfm_end": "SNG 8:14",
        "next": {
            "book": {
                "name": "Isaiah",
                "id": "Isa"
            }
        },
        "previous": {
            "book": {
                "name": "Ecclesiastes",
                "id": "Eccl"
            }
        },
        "abbreviations": [
            "Song",
            "Song of Songs",
            "SOS.",
            "So.",
            "Canticle of Canticles",
            "Canticles",
            "Cant."
        ]
    },
    "ISA": {
        "chapterCount": 66,
        "chapterVerseCountPairings": {
            "1": 31,
            "2": 22,
            "3": 26,
            "4": 6,
            "5": 30,
            "6": 13,
            "7": 25,
            "8": 23,
            "9": 20,
            "10": 34,
            "11": 16,
            "12": 6,
            "13": 22,
            "14": 32,
            "15": 9,
            "16": 14,
            "17": 14,
            "18": 7,
            "19": 25,
            "20": 6,
            "21": 17,
            "22": 25,
            "23": 18,
            "24": 23,
            "25": 12,
            "26": 21,
            "27": 13,
            "28": 29,
            "29": 24,
            "30": 33,
            "31": 9,
            "32": 20,
            "33": 24,
            "34": 17,
            "35": 10,
            "36": 22,
            "37": 38,
            "38": 22,
            "39": 8,
            "40": 31,
            "41": 29,
            "42": 25,
            "43": 28,
            "44": 28,
            "45": 25,
            "46": 13,
            "47": 15,
            "48": 22,
            "49": 26,
            "50": 11,
            "51": 23,
            "52": 15,
            "53": 12,
            "54": 17,
            "55": 13,
            "56": 12,
            "57": 21,
            "58": 14,
            "59": 21,
            "60": 22,
            "61": 11,
            "62": 12,
            "63": 19,
            "64": 11,
            "65": 25,
            "66": 24
        },
        "name": "Isaiah",
        "abbr": "ISA",
        "ord": "23",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Isa",
        "usfm_end": "ISA 66:24",
        "next": {
            "book": {
                "name": "Jeremiah",
                "id": "Jer"
            }
        },
        "previous": {
            "book": {
                "name": "Song of Solomon",
                "id": "Song"
            }
        },
        "abbreviations": [
            "Isa.",
            "Is."
        ]
    },
    "JER": {
        "chapterCount": 52,
        "chapterVerseCountPairings": {
            "1": 19,
            "2": 37,
            "3": 25,
            "4": 31,
            "5": 31,
            "6": 30,
            "7": 34,
            "8": 23,
            "9": 25,
            "10": 25,
            "11": 23,
            "12": 17,
            "13": 27,
            "14": 22,
            "15": 21,
            "16": 21,
            "17": 27,
            "18": 23,
            "19": 15,
            "20": 18,
            "21": 14,
            "22": 30,
            "23": 40,
            "24": 10,
            "25": 38,
            "26": 24,
            "27": 22,
            "28": 17,
            "29": 32,
            "30": 24,
            "31": 40,
            "32": 44,
            "33": 26,
            "34": 22,
            "35": 19,
            "36": 32,
            "37": 21,
            "38": 28,
            "39": 18,
            "40": 16,
            "41": 18,
            "42": 22,
            "43": 13,
            "44": 30,
            "45": 5,
            "46": 28,
            "47": 7,
            "48": 47,
            "49": 39,
            "50": 46,
            "51": 64,
            "52": 34
        },
        "name": "Jeremiah",
        "abbr": "JER",
        "ord": "24",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Jer",
        "usfm_end": "JER 52:34",
        "next": {
            "book": {
                "name": "Lamentations",
                "id": "Lam"
            }
        },
        "previous": {
            "book": {
                "name": "Isaiah",
                "id": "Isa"
            }
        },
        "abbreviations": [
            "Jer.",
            "Je.",
            "Jr."
        ]
    },
    "LAM": {
        "chapterCount": 5,
        "chapterVerseCountPairings": {
            "1": 22,
            "2": 22,
            "3": 66,
            "4": 22,
            "5": 22
        },
        "name": "Lamentations",
        "abbr": "LAM",
        "ord": "25",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Lam",
        "usfm_end": "LAM 5:22",
        "next": {
            "book": {
                "name": "Ezekiel",
                "id": "Ezek"
            }
        },
        "previous": {
            "book": {
                "name": "Jeremiah",
                "id": "Jer"
            }
        },
        "abbreviations": [
            "Lam.",
            "La."
        ]
    },
    "EZK": {
        "chapterCount": 48,
        "chapterVerseCountPairings": {
            "1": 28,
            "2": 10,
            "3": 27,
            "4": 17,
            "5": 17,
            "6": 14,
            "7": 27,
            "8": 18,
            "9": 11,
            "10": 22,
            "11": 25,
            "12": 28,
            "13": 23,
            "14": 23,
            "15": 8,
            "16": 63,
            "17": 24,
            "18": 32,
            "19": 14,
            "20": 44,
            "21": 37,
            "22": 31,
            "23": 49,
            "24": 27,
            "25": 17,
            "26": 21,
            "27": 36,
            "28": 26,
            "29": 21,
            "30": 26,
            "31": 18,
            "32": 32,
            "33": 33,
            "34": 31,
            "35": 15,
            "36": 38,
            "37": 28,
            "38": 23,
            "39": 29,
            "40": 49,
            "41": 26,
            "42": 20,
            "43": 27,
            "44": 31,
            "45": 25,
            "46": 24,
            "47": 23,
            "48": 35
        },
        "name": "Ezekiel",
        "abbr": "EZK",
        "ord": "26",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Ezek",
        "usfm_end": "EZK 48:35",
        "next": {
            "book": {
                "name": "Daniel",
                "id": "Dan"
            }
        },
        "previous": {
            "book": {
                "name": "Lamentations",
                "id": "Lam"
            }
        },
        "abbreviations": [
            "Ezek.",
            "Eze.",
            "Ezk."
        ]
    },
    "DAN": {
        "chapterCount": 12,
        "chapterVerseCountPairings": {
            "1": 21,
            "2": 49,
            "3": 33,
            "4": 34,
            "5": 30,
            "6": 29,
            "7": 28,
            "8": 27,
            "9": 27,
            "10": 21,
            "11": 45,
            "12": 13
        },
        "name": "Daniel",
        "abbr": "DAN",
        "ord": "27",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Dan",
        "usfm_end": "DAN 12:13",
        "next": {
            "book": {
                "name": "Hosea",
                "id": "Hos"
            }
        },
        "previous": {
            "book": {
                "name": "Ezekiel",
                "id": "Ezek"
            }
        },
        "abbreviations": [
            "Dan.",
            "Da.",
            "Dn."
        ]
    },
    "HOS": {
        "chapterCount": 14,
        "chapterVerseCountPairings": {
            "1": 9,
            "2": 25,
            "3": 5,
            "4": 19,
            "5": 15,
            "6": 11,
            "7": 16,
            "8": 14,
            "9": 17,
            "10": 15,
            "11": 11,
            "12": 15,
            "13": 15,
            "14": 10
        },
        "name": "Hosea",
        "abbr": "HOS",
        "ord": "28",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Hos",
        "usfm_end": "HOS 14:9",
        "next": {
            "book": {
                "name": "Joel",
                "id": "Joel"
            }
        },
        "previous": {
            "book": {
                "name": "Daniel",
                "id": "Dan"
            }
        },
        "abbreviations": [
            "Hos.",
            "Ho."
        ]
    },
    "JOL": {
        "chapterCount": 4,
        "chapterVerseCountPairings": {
            "1": 20,
            "2": 27,
            "3": 5,
            "4": 21
        },
        "name": "Joel",
        "abbr": "JOL",
        "ord": "29",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Joel",
        "usfm_end": "JOL 3:21",
        "next": {
            "book": {
                "name": "Amos",
                "id": "Amos"
            }
        },
        "previous": {
            "book": {
                "name": "Hosea",
                "id": "Hos"
            }
        },
        "abbreviations": [
            "Joel",
            "Jl."
        ]
    },
    "AMO": {
        "chapterCount": 9,
        "chapterVerseCountPairings": {
            "1": 15,
            "2": 16,
            "3": 15,
            "4": 13,
            "5": 27,
            "6": 14,
            "7": 17,
            "8": 14,
            "9": 15
        },
        "name": "Amos",
        "abbr": "AMO",
        "ord": "30",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Amos",
        "usfm_end": "AMO 9:15",
        "next": {
            "book": {
                "name": "Obadiah",
                "id": "Obad"
            }
        },
        "previous": {
            "book": {
                "name": "Joel",
                "id": "Joel"
            }
        },
        "abbreviations": [
            "Amos",
            "Am."
        ]
    },
    "OBA": {
        "chapterCount": 1,
        "chapterVerseCountPairings": {
            "1": 21
        },
        "name": "Obadiah",
        "abbr": "OBA",
        "ord": "31",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Obad",
        "usfm_end": "OBA 1:21",
        "next": {
            "book": {
                "name": "Jonah",
                "id": "Jonah"
            }
        },
        "previous": {
            "book": {
                "name": "Amos",
                "id": "Amos"
            }
        },
        "abbreviations": [
            "Obad.",
            "Ob."
        ]
    },
    "JON": {
        "chapterCount": 4,
        "chapterVerseCountPairings": {
            "1": 16,
            "2": 11,
            "3": 10,
            "4": 11
        },
        "name": "Jonah",
        "abbr": "JON",
        "ord": "32",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Jonah",
        "usfm_end": "JON 4:11",
        "next": {
            "book": {
                "name": "Micah",
                "id": "Mic"
            }
        },
        "previous": {
            "book": {
                "name": "Obadiah",
                "id": "Obad"
            }
        },
        "abbreviations": [
            "Jonah",
            "Jnh.",
            "Jon."
        ]
    },
    "MIC": {
        "chapterCount": 7,
        "chapterVerseCountPairings": {
            "1": 16,
            "2": 13,
            "3": 12,
            "4": 14,
            "5": 14,
            "6": 16,
            "7": 20
        },
        "name": "Micah",
        "abbr": "MIC",
        "ord": "33",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Mic",
        "usfm_end": "MIC 7:20",
        "next": {
            "book": {
                "name": "Nahum",
                "id": "Nah"
            }
        },
        "previous": {
            "book": {
                "name": "Jonah",
                "id": "Jonah"
            }
        },
        "abbreviations": [
            "Mic.",
            "Mc."
        ]
    },
    "NAM": {
        "chapterCount": 3,
        "chapterVerseCountPairings": {
            "1": 14,
            "2": 14,
            "3": 19
        },
        "name": "Nahum",
        "abbr": "NAM",
        "ord": "34",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Nah",
        "usfm_end": "NAM 3:19",
        "next": {
            "book": {
                "name": "Habakkuk",
                "id": "Hab"
            }
        },
        "previous": {
            "book": {
                "name": "Micah",
                "id": "Mic"
            }
        },
        "abbreviations": [
            "Nah.",
            "Na."
        ]
    },
    "HAB": {
        "chapterCount": 3,
        "chapterVerseCountPairings": {
            "1": 17,
            "2": 20,
            "3": 19
        },
        "name": "Habakkuk",
        "abbr": "HAB",
        "ord": "35",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Hab",
        "usfm_end": "HAB 3:19",
        "next": {
            "book": {
                "name": "Zephaniah",
                "id": "Zeph"
            }
        },
        "previous": {
            "book": {
                "name": "Nahum",
                "id": "Nah"
            }
        },
        "abbreviations": [
            "Hab.",
            "Hb."
        ]
    },
    "ZEP": {
        "chapterCount": 3,
        "chapterVerseCountPairings": {
            "1": 18,
            "2": 15,
            "3": 20
        },
        "name": "Zephaniah",
        "abbr": "ZEP",
        "ord": "36",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Zeph",
        "usfm_end": "ZEP 3:20",
        "next": {
            "book": {
                "name": "Haggai",
                "id": "Hag"
            }
        },
        "previous": {
            "book": {
                "name": "Habakkuk",
                "id": "Hab"
            }
        },
        "abbreviations": [
            "Zeph.",
            "Zep.",
            "Zp."
        ]
    },
    "HAG": {
        "chapterCount": 2,
        "chapterVerseCountPairings": {
            "1": 15,
            "2": 23
        },
        "name": "Haggai",
        "abbr": "HAG",
        "ord": "37",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Hag",
        "usfm_end": "HAG 2:23",
        "next": {
            "book": {
                "name": "Zechariah",
                "id": "Zech"
            }
        },
        "previous": {
            "book": {
                "name": "Zephaniah",
                "id": "Zeph"
            }
        },
        "abbreviations": [
            "Hag.",
            "Hg."
        ]
    },
    "ZEC": {
        "chapterCount": 14,
        "chapterVerseCountPairings": {
            "1": 17,
            "2": 17,
            "3": 10,
            "4": 14,
            "5": 11,
            "6": 15,
            "7": 14,
            "8": 23,
            "9": 17,
            "10": 12,
            "11": 17,
            "12": 14,
            "13": 9,
            "14": 21
        },
        "name": "Zechariah",
        "abbr": "ZEC",
        "ord": "38",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Zech",
        "usfm_end": "ZEC 14:21",
        "next": {
            "book": {
                "name": "Malachi",
                "id": "Mal"
            }
        },
        "previous": {
            "book": {
                "name": "Haggai",
                "id": "Hag"
            }
        },
        "abbreviations": [
            "Zech.",
            "Zec.",
            "Zc."
        ]
    },
    "MAL": {
        "chapterCount": 3,
        "chapterVerseCountPairings": {
            "1": 14,
            "2": 17,
            "3": 24
        },
        "name": "Malachi",
        "abbr": "MAL",
        "ord": "39",
        "book_group_id": "0",
        "testament": "OT",
        "language_direction": "rtl",
        "id": "Mal",
        "usfm_end": "MAL 4:6",
        "next": {
            "book": {
                "name": "Tobit",
                "id": "Tob"
            }
        },
        "previous": {
            "book": {
                "name": "Zechariah",
                "id": "Zech"
            }
        },
        "abbreviations": [
            "Mal.",
            "Ml."
        ]
    },
    "MAT": {
        "chapterCount": 28,
        "chapterVerseCountPairings": {
            "1": 25,
            "2": 23,
            "3": 17,
            "4": 25,
            "5": 48,
            "6": 34,
            "7": 29,
            "8": 34,
            "9": 38,
            "10": 42,
            "11": 30,
            "12": 50,
            "13": 58,
            "14": 36,
            "15": 39,
            "16": 28,
            "17": 27,
            "18": 35,
            "19": 30,
            "20": 34,
            "21": 46,
            "22": 46,
            "23": 39,
            "24": 51,
            "25": 46,
            "26": 75,
            "27": 66,
            "28": 20
        },
        "name": "Matthew",
        "abbr": "MAT",
        "ord": "40",
        "book_group_id": "0",
        "testament": "NT",
        "id": "Matt",
        "usfm_end": "MAT 28:20",
        "next": {
            "book": {
                "name": "Mark",
                "id": "Mark"
            }
        },
        "previous": {
            "book": {
                "name": "2 Maccabees",
                "id": "2Macc"
            }
        },
        "abbreviations": [
            "Matt.",
            "Mt."
        ]
    },
    "MRK": {
        "chapterCount": 16,
        "chapterVerseCountPairings": {
            "1": 45,
            "2": 28,
            "3": 35,
            "4": 41,
            "5": 43,
            "6": 56,
            "7": 37,
            "8": 38,
            "9": 50,
            "10": 52,
            "11": 33,
            "12": 44,
            "13": 37,
            "14": 72,
            "15": 47,
            "16": 20
        },
        "name": "Mark",
        "abbr": "MRK",
        "ord": "41",
        "book_group_id": "0",
        "testament": "NT",
        "id": "Mark",
        "usfm_end": "MRK 16:20",
        "next": {
            "book": {
                "name": "Luke",
                "id": "Luke"
            }
        },
        "previous": {
            "book": {
                "name": "Matthew",
                "id": "Matt"
            }
        },
        "abbreviations": [
            "Mark",
            "Mrk",
            "Mar",
            "Mk",
            "Mr"
        ]
    },
    "LUK": {
        "chapterCount": 24,
        "chapterVerseCountPairings": {
            "1": 80,
            "2": 52,
            "3": 38,
            "4": 44,
            "5": 39,
            "6": 49,
            "7": 50,
            "8": 56,
            "9": 62,
            "10": 42,
            "11": 54,
            "12": 59,
            "13": 35,
            "14": 35,
            "15": 32,
            "16": 31,
            "17": 37,
            "18": 43,
            "19": 48,
            "20": 47,
            "21": 38,
            "22": 71,
            "23": 56,
            "24": 53
        },
        "name": "Luke",
        "abbr": "LUK",
        "ord": "42",
        "book_group_id": "0",
        "testament": "NT",
        "id": "Luke",
        "usfm_end": "LUK 24:53",
        "next": {
            "book": {
                "name": "John",
                "id": "John"
            }
        },
        "previous": {
            "book": {
                "name": "Mark",
                "id": "Mark"
            }
        },
        "abbreviations": [
            "Luke",
            "Luk",
            "Lk"
        ]
    },
    "JHN": {
        "chapterCount": 21,
        "chapterVerseCountPairings": {
            "1": 51,
            "2": 25,
            "3": 36,
            "4": 54,
            "5": 47,
            "6": 71,
            "7": 53,
            "8": 59,
            "9": 41,
            "10": 42,
            "11": 57,
            "12": 50,
            "13": 38,
            "14": 31,
            "15": 27,
            "16": 33,
            "17": 26,
            "18": 40,
            "19": 42,
            "20": 31,
            "21": 25
        },
        "name": "John",
        "abbr": "JHN",
        "ord": "43",
        "book_group_id": "0",
        "testament": "NT",
        "id": "John",
        "usfm_end": "JHN 21:25",
        "next": {
            "book": {
                "name": "Acts",
                "id": "Acts"
            }
        },
        "previous": {
            "book": {
                "name": "Luke",
                "id": "Luke"
            }
        },
        "abbreviations": [
            "John",
            "Joh",
            "Jhn",
            "Jn"
        ]
    },
    "ACT": {
        "chapterCount": 28,
        "chapterVerseCountPairings": {
            "1": 26,
            "2": 47,
            "3": 26,
            "4": 37,
            "5": 42,
            "6": 15,
            "7": 60,
            "8": 40,
            "9": 43,
            "10": 48,
            "11": 30,
            "12": 25,
            "13": 52,
            "14": 28,
            "15": 41,
            "16": 40,
            "17": 34,
            "18": 28,
            "19": 40,
            "20": 38,
            "21": 40,
            "22": 30,
            "23": 35,
            "24": 27,
            "25": 27,
            "26": 32,
            "27": 44,
            "28": 31
        },
        "name": "Acts",
        "abbr": "ACT",
        "ord": "44",
        "book_group_id": "0",
        "testament": "NT",
        "id": "Acts",
        "usfm_end": "ACT 28:31",
        "next": {
            "book": {
                "name": "Romans",
                "id": "Rom"
            }
        },
        "previous": {
            "book": {
                "name": "John",
                "id": "John"
            }
        },
        "abbreviations": [
            "Acts",
            "Act",
            "Ac"
        ]
    },
    "ROM": {
        "chapterCount": 16,
        "chapterVerseCountPairings": {
            "1": 32,
            "2": 29,
            "3": 31,
            "4": 25,
            "5": 21,
            "6": 23,
            "7": 25,
            "8": 39,
            "9": 33,
            "10": 21,
            "11": 36,
            "12": 21,
            "13": 14,
            "14": 23,
            "15": 33,
            "16": 27
        },
        "name": "Romans",
        "abbr": "ROM",
        "ord": "45",
        "book_group_id": "0",
        "testament": "NT",
        "id": "Rom",
        "usfm_end": "ROM 16:27",
        "next": {
            "book": {
                "name": "1 Corinthians",
                "id": "1Cor"
            }
        },
        "previous": {
            "book": {
                "name": "Acts",
                "id": "Acts"
            }
        },
        "abbreviations": [
            "Rom.",
            "Ro.",
            "Rm."
        ]
    },
    "1CO": {
        "chapterCount": 16,
        "chapterVerseCountPairings": {
            "1": 31,
            "2": 16,
            "3": 23,
            "4": 21,
            "5": 13,
            "6": 20,
            "7": 40,
            "8": 13,
            "9": 27,
            "10": 33,
            "11": 34,
            "12": 31,
            "13": 13,
            "14": 40,
            "15": 58,
            "16": 24
        },
        "name": "1 Corinthians",
        "abbr": "1CO",
        "ord": "46",
        "book_group_id": "0",
        "testament": "NT",
        "id": "1Cor",
        "usfm_end": "1CO 16:24",
        "next": {
            "book": {
                "name": "2 Corinthians",
                "id": "2Cor"
            }
        },
        "previous": {
            "book": {
                "name": "Romans",
                "id": "Rom"
            }
        },
        "abbreviations": [
            "1 Cor.",
            "1 Co.",
            "I Cor.",
            "I Co.",
            "1Cor.",
            "1Co.",
            "I Corinthians",
            "1Corinthians",
            "1st Corinthians",
            "First Corinthians"
        ]
    },
    "2CO": {
        "chapterCount": 13,
        "chapterVerseCountPairings": {
            "1": 24,
            "2": 17,
            "3": 18,
            "4": 18,
            "5": 21,
            "6": 18,
            "7": 16,
            "8": 24,
            "9": 15,
            "10": 18,
            "11": 33,
            "12": 21,
            "13": 13
        },
        "name": "2 Corinthians",
        "abbr": "2CO",
        "ord": "47",
        "book_group_id": "0",
        "testament": "NT",
        "id": "2Cor",
        "usfm_end": "2CO 13:14",
        "next": {
            "book": {
                "name": "Galatians",
                "id": "Gal"
            }
        },
        "previous": {
            "book": {
                "name": "1 Corinthians",
                "id": "1Cor"
            }
        },
        "abbreviations": [
            "2 Cor.",
            "2 Co.",
            "II Cor.",
            "II Co.",
            "2Cor.",
            "2Co.",
            "II Corinthians",
            "2Corinthians",
            "2nd Corinthians",
            "Second Corinthians"
        ]
    },
    "GAL": {
        "chapterCount": 6,
        "chapterVerseCountPairings": {
            "1": 24,
            "2": 21,
            "3": 29,
            "4": 31,
            "5": 26,
            "6": 18
        },
        "name": "Galatians",
        "abbr": "GAL",
        "ord": "48",
        "book_group_id": "0",
        "testament": "NT",
        "id": "Gal",
        "usfm_end": "GAL 6:18",
        "next": {
            "book": {
                "name": "Ephesians",
                "id": "Eph"
            }
        },
        "previous": {
            "book": {
                "name": "2 Corinthians",
                "id": "2Cor"
            }
        },
        "abbreviations": [
            "Gal.",
            "Ga."
        ]
    },
    "EPH": {
        "chapterCount": 6,
        "chapterVerseCountPairings": {
            "1": 23,
            "2": 22,
            "3": 21,
            "4": 32,
            "5": 33,
            "6": 24
        },
        "name": "Ephesians",
        "abbr": "EPH",
        "ord": "49",
        "book_group_id": "0",
        "testament": "NT",
        "id": "Eph",
        "usfm_end": "EPH 6:24",
        "next": {
            "book": {
                "name": "Philippians",
                "id": "Phil"
            }
        },
        "previous": {
            "book": {
                "name": "Galatians",
                "id": "Gal"
            }
        },
        "abbreviations": [
            "Eph.",
            "Ephes."
        ]
    },
    "PHP": {
        "chapterCount": 4,
        "chapterVerseCountPairings": {
            "1": 30,
            "2": 30,
            "3": 21,
            "4": 23
        },
        "name": "Philippians",
        "abbr": "PHP",
        "ord": "50",
        "book_group_id": "0",
        "testament": "NT",
        "id": "Phil",
        "usfm_end": "PHP 4:23",
        "next": {
            "book": {
                "name": "Colossians",
                "id": "Col"
            }
        },
        "previous": {
            "book": {
                "name": "Ephesians",
                "id": "Eph"
            }
        },
        "abbreviations": [
            "Phil.",
            "Php.",
            "Pp."
        ]
    },
    "COL": {
        "chapterCount": 4,
        "chapterVerseCountPairings": {
            "1": 29,
            "2": 23,
            "3": 25,
            "4": 18
        },
        "name": "Colossians",
        "abbr": "COL",
        "ord": "51",
        "book_group_id": "0",
        "testament": "NT",
        "id": "Col",
        "usfm_end": "COL 4:18",
        "next": {
            "book": {
                "name": "1 Thessalonians",
                "id": "1Thess"
            }
        },
        "previous": {
            "book": {
                "name": "Philippians",
                "id": "Phil"
            }
        },
        "abbreviations": [
            "Col.",
            "Co."
        ]
    },
    "1TH": {
        "chapterCount": 5,
        "chapterVerseCountPairings": {
            "1": 10,
            "2": 20,
            "3": 13,
            "4": 18,
            "5": 28
        },
        "name": "1 Thessalonians",
        "abbr": "1TH",
        "ord": "52",
        "book_group_id": "0",
        "testament": "NT",
        "id": "1Thess",
        "usfm_end": "1TH 5:28",
        "next": {
            "book": {
                "name": "2 Thessalonians",
                "id": "2Thess"
            }
        },
        "previous": {
            "book": {
                "name": "Colossians",
                "id": "Col"
            }
        },
        "abbreviations": [
            "1 Thess.",
            "1 Thes.",
            "1 Th.",
            "I Thessalonians",
            "I Thess.",
            "I Thes.",
            "I Th.",
            "1Thessalonians",
            "1Thess.",
            "1Thes.",
            "1Th.",
            "1st Thessalonians",
            "1st Thess.",
            "First Thessalonians",
            "First Thess."
        ]
    },
    "2TH": {
        "chapterCount": 3,
        "chapterVerseCountPairings": {
            "1": 12,
            "2": 17,
            "3": 18
        },
        "name": "2 Thessalonians",
        "abbr": "2TH",
        "ord": "53",
        "book_group_id": "0",
        "testament": "NT",
        "id": "2Thess",
        "usfm_end": "2TH 3:18",
        "next": {
            "book": {
                "name": "1 Timothy",
                "id": "1Tim"
            }
        },
        "previous": {
            "book": {
                "name": "1 Thessalonians",
                "id": "1Thess"
            }
        },
        "abbreviations": [
            "2 Thess.",
            "2 Thes.",
            "II Thessalonians",
            "II Thess.",
            "II Thes.",
            "II Th.",
            "2Thessalonians",
            "2Thess.",
            "2Thes.",
            "2Th.",
            "2nd Thessalonians",
            "2nd Thess.",
            "Second Thessalonians",
            "Second Thess."
        ]
    },
    "1TI": {
        "chapterCount": 6,
        "chapterVerseCountPairings": {
            "1": 20,
            "2": 15,
            "3": 16,
            "4": 16,
            "5": 25,
            "6": 21
        },
        "name": "1 Timothy",
        "abbr": "1TI",
        "ord": "54",
        "book_group_id": "0",
        "testament": "NT",
        "id": "1Tim",
        "usfm_end": "1TI 6:21",
        "next": {
            "book": {
                "name": "2 Timothy",
                "id": "2Tim"
            }
        },
        "previous": {
            "book": {
                "name": "2 Thessalonians",
                "id": "2Thess"
            }
        },
        "abbreviations": [
            "1 Tim.",
            "1 Ti.",
            "I Timothy",
            "I Tim.",
            "I Ti.",
            "1Timothy",
            "1Tim.",
            "1Ti.",
            "1st Timothy",
            "1st Tim.",
            "First Timothy",
            "First Tim."
        ]
    },
    "2TI": {
        "chapterCount": 4,
        "chapterVerseCountPairings": {
            "1": 18,
            "2": 26,
            "3": 17,
            "4": 22
        },
        "name": "2 Timothy",
        "abbr": "2TI",
        "ord": "55",
        "book_group_id": "0",
        "testament": "NT",
        "id": "2Tim",
        "usfm_end": "2TI 4:22",
        "next": {
            "book": {
                "name": "Titus",
                "id": "Titus"
            }
        },
        "previous": {
            "book": {
                "name": "1 Timothy",
                "id": "1Tim"
            }
        },
        "abbreviations": [
            "2 Tim.",
            "2 Ti.",
            "II Timothy",
            "II Tim.",
            "II Ti.",
            "2Timothy",
            "2Tim.",
            "2Ti.",
            "2nd Timothy",
            "2nd Tim.",
            "Second Timothy",
            "Second Tim."
        ]
    },
    "TIT": {
        "chapterCount": 3,
        "chapterVerseCountPairings": {
            "1": 16,
            "2": 15,
            "3": 15
        },
        "name": "Titus",
        "abbr": "TIT",
        "ord": "56",
        "book_group_id": "0",
        "testament": "NT",
        "id": "Titus",
        "usfm_end": "TIT 3:15",
        "next": {
            "book": {
                "name": "Philemon",
                "id": "Phlm"
            }
        },
        "previous": {
            "book": {
                "name": "2 Timothy",
                "id": "2Tim"
            }
        },
        "abbreviations": [
            "Titus",
            "Tit",
            "ti"
        ]
    },
    "PHM": {
        "chapterCount": 1,
        "chapterVerseCountPairings": {
            "1": 25
        },
        "name": "Philemon",
        "abbr": "PHM",
        "ord": "57",
        "book_group_id": "0",
        "testament": "NT",
        "id": "Phlm",
        "usfm_end": "PHM 1:25",
        "next": {
            "book": {
                "name": "Hebrews",
                "id": "Heb"
            }
        },
        "previous": {
            "book": {
                "name": "Titus",
                "id": "Titus"
            }
        },
        "abbreviations": [
            "Philem.",
            "Phm.",
            "Pm."
        ]
    },
    "HEB": {
        "chapterCount": 13,
        "chapterVerseCountPairings": {
            "1": 14,
            "2": 18,
            "3": 19,
            "4": 16,
            "5": 14,
            "6": 20,
            "7": 28,
            "8": 13,
            "9": 28,
            "10": 39,
            "11": 40,
            "12": 29,
            "13": 25
        },
        "name": "Hebrews",
        "abbr": "HEB",
        "ord": "58",
        "book_group_id": "0",
        "testament": "NT",
        "id": "Heb",
        "usfm_end": "HEB 13:25",
        "next": {
            "book": {
                "name": "James",
                "id": "Jas"
            }
        },
        "previous": {
            "book": {
                "name": "Philemon",
                "id": "Phlm"
            }
        },
        "abbreviations": ["Heb."]
    },
    "JAS": {
        "chapterCount": 5,
        "chapterVerseCountPairings": {
            "1": 27,
            "2": 26,
            "3": 18,
            "4": 17,
            "5": 20
        },
        "name": "James",
        "abbr": "JAS",
        "ord": "59",
        "book_group_id": "0",
        "testament": "NT",
        "id": "Jas",
        "usfm_end": "JAS 5:20",
        "next": {
            "book": {
                "name": "1 Peter",
                "id": "1Pet"
            }
        },
        "previous": {
            "book": {
                "name": "Hebrews",
                "id": "Heb"
            }
        },
        "abbreviations": [
            "James",
            "Jas",
            "Jm"
        ]
    },
    "1PE": {
        "chapterCount": 5,
        "chapterVerseCountPairings": {
            "1": 25,
            "2": 25,
            "3": 22,
            "4": 19,
            "5": 14
        },
        "name": "1 Peter",
        "abbr": "1PE",
        "ord": "60",
        "book_group_id": "0",
        "testament": "NT",
        "id": "1Pet",
        "usfm_end": "1PE 5:14",
        "next": {
            "book": {
                "name": "2 Peter",
                "id": "2Pet"
            }
        },
        "previous": {
            "book": {
                "name": "James",
                "id": "Jas"
            }
        },
        "abbreviations": [
            "1 Pet.",
            "1 Pe.",
            "1 Pt.",
            "1 P.",
            "I Pet.",
            "I Pt.",
            "I Pe.",
            "1Peter",
            "1Pet.",
            "1Pe.",
            "1Pt.",
            "1P.",
            "I Peter",
            "1st Peter",
            "First Peter"
        ]
    },
    "2PE": {
        "chapterCount": 3,
        "chapterVerseCountPairings": {
            "1": 21,
            "2": 22,
            "3": 18
        },
        "name": "2 Peter",
        "abbr": "2PE",
        "ord": "61",
        "book_group_id": "0",
        "testament": "NT",
        "id": "2Pet",
        "usfm_end": "2PE 3:18",
        "next": {
            "book": {
                "name": "1 John",
                "id": "1John"
            }
        },
        "previous": {
            "book": {
                "name": "1 Peter",
                "id": "1Pet"
            }
        },
        "abbreviations": [
            "2 Pet.",
            "2 Pe.",
            "2 Pt.",
            "2 P.",
            "II Peter",
            "II Pet.",
            "II Pt.",
            "II Pe.",
            "2Peter",
            "2Pet.",
            "2Pe.",
            "2Pt.",
            "2P.",
            "2nd Peter",
            "Second Peter"
        ]
    },
    "1JN": {
        "chapterCount": 5,
        "chapterVerseCountPairings": {
            "1": 10,
            "2": 29,
            "3": 24,
            "4": 21,
            "5": 21
        },
        "name": "1 John",
        "abbr": "1JN",
        "ord": "62",
        "book_group_id": "0",
        "testament": "NT",
        "id": "1John",
        "usfm_end": "1JN 5:21",
        "next": {
            "book": {
                "name": "2 John",
                "id": "2John"
            }
        },
        "previous": {
            "book": {
                "name": "2 Peter",
                "id": "2Pet"
            }
        },
        "abbreviations": [
            "1 John",
            "1 Jhn.",
            "1 Jn.",
            "1 J.",
            "1John",
            "1Jhn.",
            "1Joh.",
            "1Jn.",
            "1Jo.",
            "1J.",
            "I John",
            "I Jhn.",
            "I Joh.",
            "I Jn.",
            "I Jo.",
            "1st John",
            "First John"
        ]
    },
    "2JN": {
        "chapterCount": 1,
        "chapterVerseCountPairings": {
            "1": 13
        },
        "name": "2 John",
        "abbr": "2JN",
        "ord": "63",
        "book_group_id": "0",
        "testament": "NT",
        "id": "2John",
        "usfm_end": "2JN 1:13",
        "next": {
            "book": {
                "name": "3 John",
                "id": "3John"
            }
        },
        "previous": {
            "book": {
                "name": "1 John",
                "id": "1John"
            }
        },
        "abbreviations": [
            "2 John",
            "2 Jhn.",
            "2 Jn.",
            "2 J.",
            "2John",
            "2Jhn.",
            "2Joh.",
            "2Jn.",
            "2Jo.",
            "2J.",
            "II John",
            "II Jhn.",
            "II Joh.",
            "II Jn.",
            "II Jo.",
            "2nd John",
            "Second John"
        ]
    },
    "3JN": {
        "chapterCount": 1,
        "chapterVerseCountPairings": {
            "1": 15
        },
        "name": "3 John",
        "abbr": "3JN",
        "ord": "64",
        "book_group_id": "0",
        "testament": "NT",
        "id": "3John",
        "usfm_end": "3JN 1:14",
        "next": {
            "book": {
                "name": "Jude",
                "id": "Jude"
            }
        },
        "previous": {
            "book": {
                "name": "2 John",
                "id": "2John"
            }
        },
        "abbreviations": [
            "3 John",
            "3 Jhn.",
            "3 Jn.",
            "3 J.",
            "3John",
            "3Jhn.",
            "3Joh.",
            "3Jn.",
            "3Jo.",
            "3J.",
            "III John",
            "III Jhn.",
            "III Joh.",
            "III Jn.",
            "III Jo.",
            "3rd John",
            "Third John"
        ]
    },
    "JUD": {
        "chapterCount": 1,
        "chapterVerseCountPairings": {
            "1": 25
        },
        "name": "Jude",
        "abbr": "JUD",
        "ord": "65",
        "book_group_id": "0",
        "testament": "NT",
        "id": "Jude",
        "usfm_end": "JUD 1:25",
        "next": {
            "book": {
                "name": "Revelation",
                "id": "Rev"
            }
        },
        "previous": {
            "book": {
                "name": "3 John",
                "id": "3John"
            }
        },
        "abbreviations": [
            "Jude",
            "Jud.",
            "Jd."
        ]
    },
    "REV": {
        "chapterCount": 22,
        "chapterVerseCountPairings": {
            "1": 20,
            "2": 29,
            "3": 22,
            "4": 11,
            "5": 14,
            "6": 17,
            "7": 17,
            "8": 13,
            "9": 21,
            "10": 11,
            "11": 19,
            "12": 18,
            "13": 18,
            "14": 20,
            "15": 8,
            "16": 21,
            "17": 18,
            "18": 24,
            "19": 21,
            "20": 15,
            "21": 27,
            "22": 21
        },
        "name": "Revelation",
        "abbr": "REV",
        "ord": "66",
        "book_group_id": "0",
        "testament": "NT",
        "id": "Rev",
        "usfm_end": "REV 22:21",
        "previous": {
            "book": {
                "name": "Jude",
                "id": "Jude"
            }
        },
        "abbreviations": [
            "Rev",
            "Re",
            "The Revelation"
        ]
    },
};