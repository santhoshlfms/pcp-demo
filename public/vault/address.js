function getSBShippingDetails(type) {
    switch (type) {

        case 'AT':
            return {
                "recipient_name": "Hello World",
                "line1": "fleischmarkt 20/wolfengasse 3 ",
                "line2": "",
                "city": "Vienna",
                "postal_code": "1010",
                "phone": "722194339",
                "state": "Wilmersdorf"
            }
            break;

        case 'BE':
            return {
                "recipient_name": "Hello World",
                "line1": "Avenue Louise, 315",
                "line2": "",
                "city": "Brussels",
                "postal_code": "1050",
                "phone": "067676767",
                "state": "Wilmersdorf"
            }
            break;

        case 'DE':
            return {
                "recipient_name": "Hello World",
                "line1": "Lützowplatz 17",
                "line2": "",
                "city": "Berlin",
                "postal_code": "15002",
                "phone": "067676767",
                "state": "Wilmersdorf"
            }
            break;

        case 'ES':
            return {
                "recipient_name": "Hello World",
                "line1": "Ronda Sant Pere, 35,",
                "line2": "",
                "city": "Spain",
                "postal_code": "08010",
                "phone": "676726262",
                "state": "Barcelona"
            }
            break;

        case 'GB':
            return {
                "recipient_name": "Hello World",
                "line1": "23 Church St, Bowness-on-Windermere",
                "line2": "",
                "city": "London",
                "postal_code": "15002",
                "phone": "676726262",
                "state": "Wilmersdorf"
            }
            break;

        case 'IT':
            return {
                "recipient_name": "Hello World",
                "line1": "stazione termini Roma, Italia, Via Cavour, 23",
                "line2": "",
                "city": "Italy",
                "postal_code": "00184",
                "phone": "3123456789",
                "state": "Roma"
            }
            break;


        case 'NL':
            return {
                "recipient_name": "Hello World",
                "line1": "Rietdijkstraat 96",
                "line2": "",
                "city": "Netherlands",
                "postal_code": "3151 GK",
                "phone": "612345678",
                "state": "Holland"
            }
            break;

        case "PL":
            return {
                "recipient_name": "Hello World",
                "line1": "Powstańców Śląskich 95",
                "line2": "",
                "city": "Wrocław",
                "postal_code": "53-332",
                "phone": "717383111",
                "state": ""
            }

            break;

        case 'FI':
            return {
                "recipient_name": "Hello World",
                "line1": "Test lane",
                "line2": "",
                "city": "HELSINKI",
                "postal_code": "00100",
                "phone": "358 50 123 45 67",
                "state": "Lapland"
            }
            break;

        case "US":
            return {
                "recipient_name": "Hello World",
                "line1": "Test lane",
                "line2": "",
                "city": "San Jose",
                "postal_code": "95131",
                "phone": "669 215 8030",
                "state": "CA"
            }

            break;


        case "C2":
        case "CN":
            return {
                "recipient_name": "Hello World",
                "line1": "ä¸¥æ¨è·¯161å¼„20å·201å®¤",
                "line2": "",
                "city": "ä¸Šæµ·",
                "postal_code": "200125",
                "phone": "13916985737",
                "state": "Zhejiang"
            }

            break;
    }
}


function getCusUIShippingDetails(type) {
    switch (type) {

        case 'AT':
            return {
                email: 'apm_test_arvind@test.com',
                phone: '722194339',
                givenName: 'Hello',
                surname: 'World',
                address: {
                    streetAddress: 'fleischmarkt 20/wolfengasse 3',
                    extendedAddress: '',
                    locality: 'Vienna',
                    postalCode: '1010',
                    region: 'Wilmersdorf',
                    countryCode: localStorage.getItem("country")
                }
            }

            break;

        case 'BE':
            return {
                email: 'apm_test_arvind@test.com',
                phone: '067676767',
                givenName: 'Hello',
                surname: 'World',
                address: {
                    streetAddress: 'Avenue Louise, 315',
                    extendedAddress: '',
                    locality: 'Brussels',
                    postalCode: '1050',
                    region: 'Wilmersdorf',
                    countryCode: localStorage.getItem("country")
                }
            }
            break;

        case 'DE':
            return {
                email: 'apm_test_arvind@test.com',
                phone: '067676767',
                givenName: 'Hello',
                surname: 'World',
                address: {
                    streetAddress: 'Lützowplatz 17',
                    extendedAddress: '',
                    locality: 'Berlin',
                    postalCode: '15002',
                    region: 'Wilmersdorf',
                    countryCode: localStorage.getItem("country")
                }
            }
            break;

        case 'ES':
            return {
                email: 'apm_test_arvind@test.com',
                phone: '676726262',
                givenName: 'Hello',
                surname: 'World',
                address: {
                    streetAddress: 'Ronda Sant Pere, 35,',
                    extendedAddress: '',
                    locality: 'Madrid',
                    postalCode: '08010',
                    region: 'Barcelona',
                    countryCode: localStorage.getItem("country")
                }
            }
            break;


        case 'GB':
            return {
                email: 'apm_test_arvind@test.com',
                phone: '676726262',
                givenName: 'Hello',
                surname: 'World',
                address: {
                    streetAddress: '23 Church St, Bowness-on-Windermere',
                    extendedAddress: '',
                    locality: 'London',
                    postalCode: '15002',
                    region: 'United Kingdom',
                    countryCode: localStorage.getItem("country")
                }
            }
            break;

        case 'IT':
            return {
                email: 'apm_test_arvind@test.com',
                phone: '3123456789',
                givenName: 'Hello',
                surname: 'World',
                address: {
                    streetAddress: 'stazione termini Roma, Italia, Via Cavour, 23',
                    extendedAddress: '',
                    locality: 'Italy',
                    postalCode: '00184',
                    region: 'Roma',
                    countryCode: localStorage.getItem("country")
                }
            }
            break;

        case 'NL':
            return {
                email: 'apm_test_arvind@test.com',
                phone: '612345678',
                givenName: 'Hello',
                surname: 'World',
                address: {
                    streetAddress: 'Rietdijkstraat 96',
                    extendedAddress: '',
                    locality: 'Netherlands',
                    postalCode: '3151 GK',
                    region: 'Holland',
                    countryCode: localStorage.getItem("country")
                }
            }
            break;

        case "PL":

            return {
                email: 'apm_test_arvind@test.com',
                phone: '717383111',
                givenName: 'Hello',
                surname: 'World',
                address: {
                    streetAddress: 'Powstańców Śląskich 95',
                    extendedAddress: '',
                    locality: 'Wrocław',
                    postalCode: '53-332',
                    region: '',
                    countryCode: localStorage.getItem("country")
                }
            }

            break;

        case 'FI':

            return {
                email: 'apm_test_arvind@test.com',
                phone: '358 50 123 45 67',
                givenName: 'Hello',
                surname: 'World',
                address: {
                    streetAddress: 'Test lane',
                    extendedAddress: '',
                    locality: 'HELSINKI',
                    postalCode: '00100',
                    region: 'Lapland',
                    countryCode: localStorage.getItem("country")
                }
            }

            break;

        case "US":

            return {
                email: 'apm_test_arvind@test.com',
                phone: '669 215 8030',
                givenName: 'Hello',
                surname: 'World',
                address: {
                    streetAddress: 'Test lane',
                    extendedAddress: '',
                    locality: 'CA',
                    postalCode: '95131',
                    region: 'San Jose',
                    countryCode: localStorage.getItem("country")
                }
            }

            break;


        case "C2":
        case "CN":

            return {
                email: 'apm_test_arvind@test.com',
                phone: '13916985737',
                givenName: 'Hello',
                surname: 'World',
                address: {
                    streetAddress: 'ä¸¥æ¨è·¯161å¼„20å·201å®¤',
                    extendedAddress: '',
                    locality: 'ä¸Šæµ·',
                    postalCode: '200125',
                    region: '浙江',
                    countryCode: "C2"
                }
            }

            break;
    }
}




function getInlineGuestShippingDetails(type) {
    switch (type) {

        case 'AT':
            return {
                "recipient_name": "Hello World",
                "line1": "fleischmarkt 20/wolfengasse 3 ",
                "line2": "",
                "city": "Vienna",
                "postal_code": "1010",
                "phone": "722194339",
                "state": "Wilmersdorf"
            }
            break;

        case 'BE':
            return {
                "recipient_name": "Hello World",
                "line1": "Avenue Louise, 315",
                "line2": "",
                "city": "Brussels",
                "postal_code": "1050",
                "phone": "067676767",
                "state": "Wilmersdorf"
            }
            break;

        case 'DE':
            return {
                "recipient_name": "Hello World",
                "line1": "Lützowplatz 17",
                "line2": "",
                "city": "Berlin",
                "postal_code": "15002",
                "phone": "067676767",
                "state": "Wilmersdorf"
            }
            break;

        case 'ES':
            return {
                "recipient_name": "Hello World",
                "line1": "Ronda Sant Pere, 35,",
                "line2": "",
                "city": "Spain",
                "postal_code": "08010",
                "phone": "676726262",
                "state": "Barcelona"
            }
            break;

        case 'GB':
            return {
                "recipient_name": "Hello World",
                "line1": "23 Church St, Bowness-on-Windermere",
                "line2": "",
                "city": "London",
                "postal_code": "15002",
                "phone": "676726262",
                "state": "Wilmersdorf"
            }
            break;

        case 'IT':
            return {
                "recipient_name": "Hello World",
                "line1": "stazione termini Roma, Italia, Via Cavour, 23",
                "line2": "",
                "city": "Italy",
                "postal_code": "00184",
                "phone": "3123456789",
                "state": "Roma"
            }
            break;


        case 'NL':
            return {
                "recipient_name": "Hello World",
                "line1": "Rietdijkstraat 96",
                "line2": "",
                "city": "Netherlands",
                "postal_code": "3151 GK",
                "phone": "612345678",
                "state": "Holland"
            }
            break;

        case "PL":
            return {
                "recipient_name": "Hello World",
                "line1": "Powstańców Śląskich 95",
                "line2": "",
                "city": "Wrocław",
                "postal_code": "53-332",
                "phone": "717383111",
                "state": ""
            }

            break;

        case 'FI':
            return {
                "recipient_name": "Hello World",
                "line1": "Test lane",
                "line2": "",
                "city": "HELSINKI",
                "postal_code": "00100",
                "phone": "358501234567",
                "state": "Lapland"
            }
            break;

        case "US":
            return {
                "recipient_name": "Hello World",
                "line1": "Test lane",
                "line2": "",
                "city": "San Jose",
                "postal_code": "95131",
                "phone": "1627282828",
                "state": "CA"
            }

            break;


        case "C2":
        case "CN":
            return {
                "recipient_name": "Hello World",
                "line1": "ä¸¥æ¨è·¯161å¼„20å·201å®¤",
                "line2": "",
                "city": "ä¸Šæµ·",
                "postal_code": "200125",
                "phone": "13916985737",
                "state": "Zhejiang"
            }

            break;

        case "AU":
            return {
                "recipient_name": "Hello World",
                "line1": "40 Gaggin Street",
                "line2": "",
                "city": "ASHTONFIELD",
                "postal_code": "2323",
                "phone": "0745099352",
                "state": "NSW"
            }

            break;

        case "FR":
            return {
                "recipient_name": "Hello World",
                "line1": "rue de la Mare aux Carat",
                "line2": "",
                "city": "MONTREUIL",
                "postal_code": "93100",
                "phone": "330145710048",
                "state": ""
            }

            break;

        case "HK":
            return {
                "recipient_name": "Hello World",
                "line1": "Flat 25, 12/F, Acacia Building",
                "line2": "",
                "city": "WAN CHAI",
                "postal_code": "95131",
                "phone": "85225242389",
                "state": ""
            }

            break;

        case "JP":
            return {
                "recipient_name": "Hello World",
                "line1": "Kamikamedani",
                "line2": "",
                "city": "Onan-cho Ochi-gun",
                "postal_code": "1341174",
                "phone": "81922682579",
                "state": "Shimane"
            }

            break;

        case "IN":
            return {
                "recipient_name": "Hello World",
                "line1": "Futura tech",
                "line2": "",
                "city": "Chennai",
                "postal_code": "600042",
                "phone": "919500177826",
                "state": "Tamil Nadu"
            }

            break;


        case "BR":
            return {
                "recipient_name": "Hello World",
                "line1": "Av Paulista",
                "line2": "",
                "city": "Sao Paulo",
                "postal_code": "01310000",
                "phone": "5511984565666",
                "state": "SP"
            }

            break;


        case "MX":
            return {
                "recipient_name": "Hello World",
                "line1": "Morelos 100 depto",
                "line2": "",
                "city": "Campeche",
                "postal_code": "50000",
                "phone": "525512345678",
                "state": "Estado de Mexico"
            }

            break;



        default:

            return {
                "recipient_name": "Hello World",
                "line1": "Test lane",
                "line2": "",
                "city": "San Jose",
                "postal_code": "95131",
                "phone": "1627282828",
                "state": "CA"
            }

            break;

    }


}

