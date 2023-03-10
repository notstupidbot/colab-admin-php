const speaker_ids = [
  {
    "name": "JV-00027",
    "alias": "Andi",
    "gender": "M",
    "age": 23,
    "fast": false
  },
  {
    "name": "JV-00264",
    "alias": "Puput",
    "gender": "F",
    "age": 18,
    "fast": false
  },
  {
    "name": "JV-00658",
    "alias": "Grace",
    "gender": "F",
    "age": 17,
    "fast": true
  },
  {
    "name": "JV-01392",
    "alias": "Wati",
    "gender": "F",
    "age": 24,
    "fast": false
  },
  {
    "name": "JV-01519",
    "alias": "Jupri",
    "gender": "M",
    "age": 18,
    "fast": true
  },
  {
    "name": "JV-01932",
    "alias": "Joko",
    "gender": "M",
    "age": 27,
    "fast": false
  },
  {
    "name": "JV-02059",
    "alias": "Eka",
    "gender": "F",
    "age": 17,
    "fast": false
  },
  {
    "name": "JV-02326",
    "alias": "Andri",
    "gender": "M",
    "age": 18,
    "fast": true
  },
  {
    "name": "JV-02884",
    "alias": "Sri",
    "gender": "F",
    "age": 25,
    "fast": false
  },
  {
    "name": "JV-03187",
    "alias": "Anita Agustina",
    "gender": "F",
    "age": 24,
    "fast": false
  },
  {
    "name": "JV-03314",
    "alias": "Tono",
    "gender": "M",
    "age": 17,
    "fast": false
  },
  {
    "name": "JV-03424",
    "alias": "Edo",
    "gender": "M",
    "age": 28,
    "fast": false
  },
  {
    "name": "JV-03727",
    "alias": "Ucup",
    "gender": "F",
    "age": 27,
    "fast": false
  },
  {
    "name": "JV-04175",
    "alias": "Dodo",
    "gender": "M",
    "age": 19,
    "fast": false
  },
  {
    "name": "JV-04285",
    "alias": "Bariton 1",
    "gender": "M",
    "age": 38,
    "fast": false
  },
  {
    "name": "JV-04588",
    "alias": "Tenor",
    "gender": "M",
    "age": 26,
    "fast": false
  },
  {
    "name": "JV-04679",
    "alias": "Cici",
    "gender": "F",
    "age": 16,
    "fast": false
  },
  {
    "name": "JV-04715",
    "alias": "Dinda",
    "gender": "F",
    "age": 23,
    "fast": false
  },
  {
    "name": "JV-04982",
    "alias": "Mimin",
    "gender": "F",
    "age": 27,
    "fast": false
  },
  {
    "name": "JV-05219",
    "alias": "Wartub",
    "gender": "M",
    "age": 27,
    "fast": false
  },
  {
    "name": "JV-05522",
    "alias": "Marno",
    "gender": "M",
    "age": 29,
    "fast": false
  },
  {
    "name": "JV-05540",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "JV-05667",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "JV-05970",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "JV-06080",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "JV-06207",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "JV-06383",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "JV-06510",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "JV-06941",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "JV-07335",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "JV-07638",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "JV-07765",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "JV-07875",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "JV-08002",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "JV-08178",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "JV-08305",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "JV-08736",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "JV-09039",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "JV-09724",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-00060",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-00297",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-00454",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-00600",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-00691",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-00994",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-01038",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-01056",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-01359",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-01552",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-01596",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-01855",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-01899",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-02092",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-02395",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-02716",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-02953",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-03391",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-03650",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-03694",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-03712",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-03887",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-04190",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-04208",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-04511",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-04646",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-04748",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-05051",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-05186",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-05507",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-06003",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-06047",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-06543",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-07302",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-07842",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-08338",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-08659",
    "alias": "",
    "gender": "",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-08703",
    "alias": "Marni",
    "gender": "F",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-09243",
    "alias": "Karno",
    "gender": "M",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-09637",
    "alias": "Wandu",
    "gender": "M",
    "age": 18,
    "fast": false
  },
  {
    "name": "SU-09757",
    "alias": "Edi",
    "gender": "M",
    "age": 33,
    "fast": false
  },
  {
    "name": "ardi",
    "alias": "Ardi",
    "gender": "M",
    "age": 18,
    "fast": false
  },
  {
    "name": "gadis",
    "alias": "Gadis",
    "gender": "F",
    "age": 23,
    "fast": false
  },
  {
    "name": "wibowo",
    "alias": "Wobowo",
    "gender": "M",
    "age": 30,
    "fast": false
  }
];

export default speaker_ids;