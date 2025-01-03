
const Pdfmake = require(`pdfmake`);
const dotenv = require("dotenv");
dotenv.config();
// const { constant: { fontsPath, logo, Messages, containerNames, permissions }, constant } = require(`../constants`);
// const { util: { formatTimestamptoDateMonthYear, getLatestEducation, getBase64ImageFromURL, formatErrorResponse, isEmptyArray, ERROR, isEmptyObject, getExperience, getExpertise } } = require(`../helper`);
// const blobService = require(`./blobService`);


const fontsPath = {
    TrebuchetMS: {
        normal: './src/fonts/trebuchet-ms/trebuc.ttf',
        italics: './src/fonts/trebuchet-ms/Trebuchet-MS-Italic.ttf',
    },
    TimesNewRoman: {
        normal: './src/fonts/TimesNewRoman/times new roman.ttf',
        bold: './src/fonts/TimesNewRoman/times new roman italic.ttf',
        italics: './src/fonts/TimesNewRoman/times new roman bold.ttf',
        bolditalics: './src/fonts/TimesNewRoman/times new roman bold italic.ttf'
    },
    Roboto: {
        normal: './src/fonts/Roboto/Roboto-Regular.ttf',
        bold: './src/fonts/Roboto/Roboto-Medium.ttf',
        italics: './src/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: './src/fonts/Roboto/Roboto-MediumItalic.ttf'
    }
}
const options = {
    wordwrap: 130,
};

exports.pdfCreation = async (userData) => {
    if (!isEmptyObject(userData)) {

       try {
        let fileName = userData.id + `.pdf`;
        let profileDocPath = `u-r-l`;

        const profileImage = (userData.profileImage || userData.profileImage === "") ? await getBase64ImageFromURL(await blobService.createSASUrl(userData.profileImage, containerNames.PROFILE_PIC, permissions.READ)) : await getBase64ImageFromURL(logo.account);

        let pdfContent = {

            header:
            {
                text: "MoveE Application",
                alignment: `center`,
                margin: [0, 10, 0, 0],
                width: 50,
                color: `grey`
            },
            footer:
                function (currentPage, pageCount) {
                    return {
                        text: `https://reddy-movee-app.netlify.app/                                   Page ${currentPage.toString()} of ${pageCount}                             Latest update: ${formatTimestamptoDateMonthYear(userData?._ts ? userData._ts : 'dd.mm.yyyy')}`,
                        style: `footer`
                    };
                },
            styles: {
                header: {
                    alignment: `center`
                },
                footer: {
                    alignment: `center`,
                    fontSize: 8,
                    margin: [0, 10, 0, 0]
                },
                subHeader: {
                    alignment: `left`,
                    fontSize: 4,
                },
                value: {
                    alignment: `left`,
                    fontSize: 8,
                },
                userName: {
                    alignment: `left`,
                    fontSize: 8,
                }
            },
            content: [
                {
                    canvas: [
                        {
                            type: `line`,
                            style: `borderLine`,
                            x1: -20,
                            y1: 20,
                            x2: 500,
                            y2: 20,
                            lineWidth: 1,
                            color: `grey`
                        },
                    ],
                },
                {
                    columns: [
                        {
                            image: profileImage,
                            alignment: `left`,
                            margin: [0, 0, 0, 0],
                            width: 50,
                            heigth: 50
                        },
                        [
                            {
                                text: userData.firstName ? userData.firstName : "" + ` ` + userData.lastName ? userData.lastName : "",
                                style: `userName`,
                                fontSize: 12,
                                margin: [10, 5, 0, 0],
                            },
                            {
                                text: (userData.city && userData.state && userData.country) ? userData.city.toUpperCase() + `, ` + userData.state.toUpperCase() + `, ` + userData.country.toUpperCase() : "",
                                style: `subheader`,
                                color: `grey`,
                                fontSize: 8,
                                margin: [10, 5, 0, 0],
                            }
                        ],
                        {
                            image: qrCodeImage,
                            alignment: `left`,
                            margin: [0, 0, 0, 0],
                            width: 50,
                            heigth: 50

                        },

                    ],
                    margin: [0, 20, 0, 0]
                },
                {
                    canvas: [
                        {
                            type: `line`,
                            x1: -20,
                            y1: 10,
                            x2: 500,
                            y2: 10,
                            lineWidth: 1,
                            color: `grey`
                        },
                    ],
                },
                {
                    columns: [
                        [
                            {
                                text: `EMAIL ADDRESS`,
                                style: `subheader`,
                                color: `grey`,
                                fontSize: 8,
                                width: 500,
                                margin: [10, 10, 0, 0],
                            },
                            {
                                text: userData.email ? userData.email : "",
                                style: `value`,
                                width: 500,
                                margin: [10, 10, 0, 0],
                            }
                        ],
                        {
                            // Vertical Line 
                            canvas: [
                                {
                                    type: `line`,
                                    x1: 80,
                                    y1: 0,
                                    x2: 80,
                                    y2: 55,
                                    lineWidth: 1,
                                    color: `grey`
                                },
                            ],
                        },
                        [
                            {
                                text: `PHONE NUMBER`,
                                color: `grey`,
                                style: `subheader`,
                                fontSize: 8,
                                margin: [-30, 10, 0, 0],
                            },
                            {
                                text: userData.phone ? userData.phone : "",
                                style: `value`,
                                margin: [-30, 10, 0, 0],
                            }
                        ],

                    ]
                },
                {
                    canvas: [
                        {
                            type: `line`,
                            x1: -20,
                            y1: 0,
                            x2: 500,
                            y2: 0,
                            lineWidth: 1,
                            color: `grey`
                        },
                    ],
                },
                [
                    {
                        text: `ABOUT ME`,
                        color: `grey`,
                        style: `subheader`,
                        fontSize: 8,
                        margin: [10, 10, 0, 0],
                    },
                    {
                        text: userData.aboutMe ? userData.aboutMe : "",
                        style: `value`,
                        margin: [10, 10, 0, 0],
                    }
                ],
                {
                    canvas: [
                        {
                            type: `line`,
                            x1: -20,
                            y1: 10,
                            x2: 500,
                            y2: 10,
                            lineWidth: 1,
                            color: `grey`
                        },
                    ],
                },
                {
                    columns: [
                        [

                            {
                                text: `CANDIDATE JOB TITLE`,
                                color: `grey`,
                                style: `subheader`,
                                fontSize: 8,
                                width: 500,
                                margin: [10, 10, 0, 0],
                            },
                            {
                                text: (userData.experience && !isEmptyArray(userData.experience)) ? await userData.experience.filter((e) => e.isCurrentlyWorking)[0].jobTitle : "",
                                style: `value`,
                                width: 500,
                                margin: [10, 10, 0, 0],
                            }
                        ],
                        {
                            // Vertical Line 
                            canvas: [
                                {
                                    type: `line`,
                                    x1: 90,
                                    y1: 0,
                                    x2: 90,
                                    y2: 55,
                                    lineWidth: 1,
                                    color: `grey`
                                },
                            ],
                        },
                        [
                            {
                                text: `BASE SALARY`,
                                color: `grey`,
                                style: `subheader`,
                                fontSize: 8,
                                margin: [-30, 10, 0, 0],
                            },
                            {
                                text: userData.earning ? `€` + JSON.stringify(userData.earning) : "",
                                style: `value`,
                                margin: [-30, 10, 0, 0],
                            }
                        ],

                    ]
                },
                {
                    canvas: [
                        {
                            type: `line`,
                            x1: -20,
                            y1: 0,
                            x2: 500,
                            y2: 0,
                            lineWidth: 1,
                            color: `grey`
                        },
                    ],
                },
                {
                    columns: [
                        [

                            {
                                text: `INDUSTRY`,
                                color: `grey`,
                                style: `subheader`,
                                fontSize: 8,
                                width: 500,
                                margin: [10, 10, 0, 0],
                            },
                            {
                                text: userData.expertise && !isEmptyArray(userData.expertise) && await getExpertise(userData.expertise),
                                style: `value`,
                                width: 500,
                                margin: [10, 10, 0, 10],
                            }
                        ],
                        // {
                        //     // Vertical Line 
                        //     canvas: [
                        //         {
                        //             type: `line`,
                        //             x1: 70,
                        //             y1: 0,
                        //             x2: 70,
                        //             y2: 55,
                        //             lineWidth: 1,
                        //             color: `grey`
                        //         },
                        //     ],
                        // },
                    ]
                },
                {
                    canvas: [
                        {
                            type: `line`,
                            x1: -20,
                            y1: 0,
                            x2: 500,
                            y2: 0,
                            lineWidth: 1,
                            color: `grey`
                        },
                    ],
                },

                {
                    columns: [
                        [

                            {
                                text: `COUNTRY`,
                                color: `grey`,
                                style: `subheader`,
                                fontSize: 8,
                                width: 500,
                                margin: [10, 10, 0, 0],
                            },
                            {
                                text: userData.country ? userData.country : "",
                                style: `value`,
                                width: 500,
                                margin: [10, 10, 0, 0],
                            }
                        ],
                        {
                            // Vertical Line 
                            canvas: [
                                {
                                    type: `line`,
                                    x1: 33,
                                    y1: 0,
                                    x2: 33,
                                    y2: 55,
                                    lineWidth: 1,
                                    color: `grey`
                                },
                            ],
                        },
                        [
                            {
                                text: `STATE`,
                                color: `grey`,
                                style: `subheader`,
                                fontSize: 8,
                                margin: [-30, 10, 0, 0],
                            },
                            {
                                text: userData.state ? userData.state : "",
                                style: `value`,
                                margin: [-30, 10, 0, 0],
                            }
                        ],
                        {
                            // Vertical Line 
                            canvas: [
                                {
                                    type: `line`,
                                    x1: 33,
                                    y1: 0,
                                    x2: 33,
                                    y2: 55,
                                    lineWidth: 1,
                                    color: `grey`
                                },
                            ],
                        },
                        [
                            {
                                text: `CITY/TOWN`,
                                color: `grey`,
                                style: `subheader`,
                                fontSize: 8,
                                margin: [-30, 10, 0, 0],
                            },
                            {
                                text: userData.city ? userData.city : "",
                                style: `value`,
                                margin: [-30, 10, 0, 0],
                            }
                        ],

                    ]
                },
                {
                    canvas: [
                        {
                            type: `line`,
                            x1: -20,
                            y1: 0,
                            x2: 500,
                            y2: 0,
                            lineWidth: 1,
                            color: `grey`
                        },
                    ],
                },
                [
                    {
                        text: `HARD SKILLS`,
                        color: `grey`,
                        style: `subheader`,
                        fontSize: 8,
                        margin: [10, 10, 0, 0],
                    },
                    {
                        text: (userData.hardSkills && !isEmptyArray(userData.hardSkills)) ? await userData.hardSkills.map((e) => e.name.concat(` (` + e.yearOfExperience + `)`)).join(`, `) : "",
                        margin: [10, 10, 0, 0],
                        style: `value`
                    }
                ],
                {
                    canvas: [
                        {
                            type: `line`,
                            x1: -20,
                            y1: 10,
                            x2: 500,
                            y2: 10,
                            lineWidth: 1,
                            color: `grey`
                        },
                    ],
                },
                [
                    {
                        text: `SOFT SKILLS`,
                        color: `grey`,
                        style: `subheader`,
                        fontSize: 8,
                        margin: [10, 10, 0, 0],
                    },
                    {
                        text: (userData.humanSkills && !isEmptyArray(userData.humanSkills)) ? userData.humanSkills.join(`, `) : "",
                        style: `value`,
                        margin: [10, 10, 0, 0],
                    }
                ],
                {
                    canvas: [
                        {
                            type: `line`,
                            x1: -20,
                            y1: 10,
                            x2: 500,
                            y2: 10,
                            lineWidth: 1,
                            color: `grey`
                        },
                    ],
                },
                [
                    {
                        text: `EDUCATION`,
                        color: `grey`,
                        style: `subheader`,
                        fontSize: 8,
                        margin: [10, 10, 0, 0],
                    },
                    {
                        text: (userData.education && !isEmptyArray(userData.education)) ? await getLatestEducation(userData.education) : "",
                        style: `value`,
                        margin: [10, 10, 0, 0],
                    }
                ],
                {
                    canvas: [
                        {
                            type: `line`,
                            x1: -20,
                            y1: 10,
                            x2: 500,
                            y2: 10,
                            lineWidth: 1,
                            color: `grey`
                        },
                    ],
                },
                [
                    {
                        text: `LANGUAGES`,
                        color: `grey`,
                        style: `subheader`,
                        fontSize: 8,
                        margin: [10, 10, 0, 0],
                    },
                    {
                        text: (userData.language && !isEmptyArray(userData.language)) ? await userData.language.map((e) => e.name.concat(`(` + e.level + `)`)).join(`, `) : "",
                        style: `value`,
                        margin: [10, 10, 0, 0],
                    }
                ],
                {
                    canvas: [
                        {
                            type: `line`,
                            x1: -20,
                            y1: 10,
                            x2: 500,
                            y2: 10,
                            lineWidth: 1,
                            color: `grey`
                        },
                    ],
                },
                [
                    {
                        text: `WORK PLACE`,
                        color: `grey`,
                        style: `subheader`,
                        fontSize: 8,
                        margin: [10, 10, 0, 0],
                    },
                    {
                        text: (userData.workPlace && !isEmptyArray(userData.workPlace)) ? userData.workPlace.join(`, `) : "",
                        style: `value`,
                        margin: [10, 10, 0, 0],
                    }
                ],
                {
                    canvas: [
                        {
                            type: `line`,
                            x1: -20,
                            y1: 10,
                            x2: 500,
                            y2: 10,
                            lineWidth: 1,
                            color: `grey`
                        },
                    ],
                },
                [
                    {
                        text: `EMPLOYMENT TYPE`,
                        color: `grey`,
                        style: `subheader`,
                        fontSize: 8,
                        margin: [10, 10, 0, 0],
                    },
                    {
                        text: (userData.employmentType && !isEmptyArray(userData.employmentType)) ? userData.employmentType.join(`, `) : "",
                        style: `value`,
                        margin: [10, 10, 0, 0],
                    }
                ],
                {
                    canvas: [
                        {
                            type: `line`,
                            x1: -20,
                            y1: 10,
                            x2: 500,
                            y2: 10,
                            lineWidth: 1,
                            color: `grey`
                        },
                    ],
                },
                [
                    {
                        text: `EXPERIENCE`,
                        color: `grey`,
                        style: `subheader`,
                        fontSize: 8,
                        margin: [10, 10, 0, 0],
                    },
                    {
                        text: (userData.experience && !isEmptyArray(userData.experience)) ? await getExperience(userData.experience) : "",
                        style: `value`,
                        margin: [10, 10, 0, 0],
                    }
                ],
                {
                    canvas: [
                        {
                            type: `line`,
                            x1: -20,
                            y1: 10,
                            x2: 500,
                            y2: 10,
                            lineWidth: 1,
                            color: `grey`
                        },
                    ],
                },
                [
                    {
                        text: `SPONSORSHIP AVAILABLE`,
                        color: `grey`,
                        style: `subheader`,
                        fontSize: 8,
                        margin: [10, 10, 0, 0],
                    },
                    {
                        text: userData.isSponsorshipAvailable === true ? `Yes` : userData.isSponsorshipAvailable === false ? `No` : "",
                        style: `value`,
                        margin: [10, 10, 0, 0],
                    }
                ],
                {
                    canvas: [
                        {
                            type: `line`,
                            x1: -20,
                            y1: 10,
                            x2: 500,
                            y2: 10,
                            lineWidth: 1,
                            color: `grey`
                        },
                    ],
                },
                [
                    {
                        text: `BENEFITS`,
                        color: `grey`,
                        style: `subheader`,
                        fontSize: 8,
                        margin: [10, 10, 0, 0],
                    },
                    {
                        text: (userData.benefits && !isEmptyArray(userData.benefits)) ? userData.benefits.join(`, `) : "",
                        style: `value`,
                        margin: [10, 10, 0, 0],
                    }
                ],
                {
                    canvas: [
                        {
                            type: `line`,
                            x1: -20,
                            y1: 10,
                            x2: 500,
                            y2: 10,
                            lineWidth: 1,
                            color: `grey`
                        },
                    ],
                },
                [
                    {
                        text: `SPEED TEST`,
                        color: `grey`,
                        style: `subheader`,
                        fontSize: 8,
                        margin: [10, 10, 0, 0],
                    },
                    {
                        text: userData.speedTest ? `Upload:${userData.speedTest.upload && userData.speedTest.upload` Mbps`}   Download: ${userData.speedTest.download && userData.speedTest.download` Mbps`}   Speed: ${userData.speedTest.speed && userData.speedTest.speed` ms`}` : "",
                        style: `value`,
                        margin: [10, 10, 0, 0],
                    }
                ],
                {
                    canvas: [
                        {
                            type: `line`,
                            x1: -20,
                            y1: 10,
                            x2: 500,
                            y2: 10,
                            lineWidth: 1,
                            color: `grey`
                        },
                    ],
                },
                [
                    {
                        text: `FACEBOOK`,
                        color: `grey`,
                        style: `subheader`,
                        fontSize: 8,
                        margin: [10, 10, 0, 0],
                    },
                    {
                        text: userData.facebook ? userData.facebook : "",
                        style: `value`,
                        margin: [10, 10, 0, 0],
                    }
                ],
                {
                    canvas: [
                        {
                            type: `line`,
                            x1: -20,
                            y1: 10,
                            x2: 500,
                            y2: 10,
                            lineWidth: 1,
                            color: `grey`
                        },
                    ],
                },
                [
                    {
                        text: `LINKEDIN
                    `,
                        color: `grey`,
                        style: `subheader`,
                        fontSize: 8,
                        margin: [10, 10, 0, 0],
                    },
                    {
                        text: userData.linkedin ? userData.linkedin : "",
                        style: `value`,
                        margin: [10, 10, 0, 0],
                    }
                ],
                {
                    canvas: [
                        {
                            type: `line`,
                            x1: -20,
                            y1: 10,
                            x2: 500,
                            y2: 10,
                            lineWidth: 1,
                            color: `grey`
                        },
                    ],
                },
            ],

            pageMargins: [
                //From Left 
                20,
                // From Top
                40,
                // From Right
                20,
                // From Bottom 
                40],
            pageSize: `A5`,
            // by default we use portrait, you can change it to landscape if you wish
            pageOrientation: `portrait`,
            // margin: [50, 120, 50, 50],
            defaultStyle: [{
                font: `TrebuchetMS`,
            }
            ]
        }

        const printer = new Pdfmake(fontsPath);
        const pdfDoc = await printer.createPdfKitDocument(pdfContent,  );

        const buffers = [];
        pdfDoc.on('data', buffers.push.bind(buffers));
        pdfDoc.on('end', async () => {
            const buffer = await Buffer.concat(buffers);

            await blobService.uploadEmployeeProfileUsingBuffer(fileName, constant.containerNames.PROFILE_DOC, buffer);
            return { url: blobService.createSASUrl(fileName, containerNames.PROFILE_DOC, permissions.READ) }
        });
        pdfDoc.end();
        return { url: await blobService.createSASUrl(fileName, containerNames.PROFILE_DOC, permissions.READ) }
       } catch (error) {
        console.log("Error in formatting : ", error);
        throw formatErrorResponse(Messages.PDF_CREATE_ERROR); 
       }
    } else {
        throw formatErrorResponse(ERROR.BAD_GATEWAY, Messages.INVALID_USER_DATA)
    }
}
