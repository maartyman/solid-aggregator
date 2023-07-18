"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query2 = exports.query1 = void 0;
exports.query1 = `SELECT  ?age ?fruits ?exercise
WHERE
  {   { { { { { { SELECT  (if(bound(?fhirConditionOnsetDateTimeValue), <https://vito.be/schema/ggdm#yes>, <https://vito.be/schema/ggdm#no>) AS ?rvar382181) (if(bound(?fhirConditionOnsetDateTimeValue), ?fhirConditionOnsetDateTimeValue, concat(str(day(now())), "-", str(month(now())), "-", str(year(now())))) AS ?rvar382180)
                  WHERE
                    { OPTIONAL
                        { ?c    a                     <http://hl7.org/fhir/Condition> ;
                                <http://hl7.org/fhir/Condition.code>  _:b0 .
                          _:b0  <http://hl7.org/fhir/CodeableConcept.coding>  _:b1 .
                          _:b1  a                     ?fhirConditionCodingClass ;
                                <http://hl7.org/fhir/Coding.system>  _:b2 .
                          _:b2  <http://hl7.org/fhir/value>  ?fhirConditionCodingSystemValue .
                          _:b1  <http://hl7.org/fhir/Coding.code>  _:b3 .
                          _:b3  <http://hl7.org/fhir/value>  "73211009" .
                          _:b1  <http://hl7.org/fhir/Coding.display>  _:b4 .
                          _:b4  <http://hl7.org/fhir/value>  ?fhirConditionCodingDisplayValue .
                          ?c    <http://hl7.org/fhir/Condition.subject>  _:b5 .
                          _:b5  <http://hl7.org/fhir/link>  ?fhirConditionSubjectLink .
                          ?c    <http://hl7.org/fhir/Condition.onsetDateTime>  _:b6 .
                          _:b6  <http://hl7.org/fhir/value>  ?fhirConditionOnsetDateTimeValue
                        }
                    }
                }
                { SELECT  (if(bound(?fhirConditionOnsetDateTimeValue), <https://vito.be/schema/ggdm#yes>, <https://vito.be/schema/ggdm#no>) AS ?rvar382177) (if(bound(?fhirConditionOnsetDateTimeValue), ?fhirConditionOnsetDateTimeValue, concat(str(day(now())), "-", str(month(now())), "-", str(year(now())))) AS ?rvar382176)
                  WHERE
                    { OPTIONAL
                        { ?c     a                     <http://hl7.org/fhir/Condition> ;
                                 <http://hl7.org/fhir/Condition.code>  _:b7 .
                          _:b7   <http://hl7.org/fhir/CodeableConcept.coding>  _:b8 .
                          _:b8   a                     ?fhirConditionCodingClass ;
                                 <http://hl7.org/fhir/Coding.system>  _:b9 .
                          _:b9   <http://hl7.org/fhir/value>  ?fhirConditionCodingSystemValue .
                          _:b8   <http://hl7.org/fhir/Coding.code>  _:b10 .
                          _:b10  <http://hl7.org/fhir/value>  "73211009" .
                          _:b8   <http://hl7.org/fhir/Coding.display>  _:b11 .
                          _:b11  <http://hl7.org/fhir/value>  ?fhirConditionCodingDisplayValue .
                          ?c     <http://hl7.org/fhir/Condition.subject>  _:b12 .
                          _:b12  <http://hl7.org/fhir/link>  ?fhirConditionSubjectLink .
                          ?c     <http://hl7.org/fhir/Condition.onsetDateTime>  _:b13 .
                          _:b13  <http://hl7.org/fhir/value>  ?fhirConditionOnsetDateTimeValue
                        }
                    }
                }
              }
              { SELECT  (if(bound(?fhirConditionOnsetDateTimeValue), <https://vito.be/schema/ggdm#yes>, <https://vito.be/schema/ggdm#no>) AS ?rvar382179) (if(bound(?fhirConditionOnsetDateTimeValue), ?fhirConditionOnsetDateTimeValue, concat(str(day(now())), "-", str(month(now())), "-", str(year(now())))) AS ?rvar382178)
                WHERE
                  { OPTIONAL
                      { ?c     a                     <http://hl7.org/fhir/Condition> ;
                               <http://hl7.org/fhir/Condition.code>  _:b14 .
                        _:b14  <http://hl7.org/fhir/CodeableConcept.coding>  _:b15 .
                        _:b15  a                     ?fhirConditionCodingClass ;
                               <http://hl7.org/fhir/Coding.system>  _:b16 .
                        _:b16  <http://hl7.org/fhir/value>  ?fhirConditionCodingSystemValue .
                        _:b15  <http://hl7.org/fhir/Coding.code>  _:b17 .
                        _:b17  <http://hl7.org/fhir/value>  "73211009" .
                        _:b15  <http://hl7.org/fhir/Coding.display>  _:b18 .
                        _:b18  <http://hl7.org/fhir/value>  ?fhirConditionCodingDisplayValue .
                        ?c     <http://hl7.org/fhir/Condition.subject>  _:b19 .
                        _:b19  <http://hl7.org/fhir/link>  ?fhirConditionSubjectLink .
                        ?c     <http://hl7.org/fhir/Condition.onsetDateTime>  _:b20 .
                        _:b20  <http://hl7.org/fhir/value>  ?fhirConditionOnsetDateTimeValue
                      }
                  }
              }
            }
            { SELECT  (if(bound(?fhirConditionOnsetDateTimeValue), <https://vito.be/schema/ggdm#yes>, <https://vito.be/schema/ggdm#no>) AS ?rvar382183) (if(bound(?fhirConditionOnsetDateTimeValue), ?fhirConditionOnsetDateTimeValue, concat(str(day(now())), "-", str(month(now())), "-", str(year(now())))) AS ?rvar382182)
              WHERE
                { OPTIONAL
                    { ?c     a                     <http://hl7.org/fhir/Condition> ;
                             <http://hl7.org/fhir/Condition.code>  _:b21 .
                      _:b21  <http://hl7.org/fhir/CodeableConcept.coding>  _:b22 .
                      _:b22  a                     ?fhirConditionCodingClass ;
                             <http://hl7.org/fhir/Coding.system>  _:b23 .
                      _:b23  <http://hl7.org/fhir/value>  ?fhirConditionCodingSystemValue .
                      _:b22  <http://hl7.org/fhir/Coding.code>  _:b24 .
                      _:b24  <http://hl7.org/fhir/value>  "73211009" .
                      _:b22  <http://hl7.org/fhir/Coding.display>  _:b25 .
                      _:b25  <http://hl7.org/fhir/value>  ?fhirConditionCodingDisplayValue .
                      ?c     <http://hl7.org/fhir/Condition.subject>  _:b26 .
                      _:b26  <http://hl7.org/fhir/link>  ?fhirConditionSubjectLink .
                      ?c     <http://hl7.org/fhir/Condition.onsetDateTime>  _:b27 .
                      _:b27  <http://hl7.org/fhir/value>  ?fhirConditionOnsetDateTimeValue
                    }
                }
            }
          }
          FILTER ( BNODE(concat("session_on_", str(?rvar382180))) = BNODE(concat("session_on_", str(?rvar382176))) )
          FILTER ( ?rvar382179 = <https://vito.be/schema/ggdm#yes> )
          FILTER ( BNODE(concat("completed_question_2_on_", str(?rvar382182))) = BNODE(concat("completed_question_2_on_", str(?rvar382178))) )
          FILTER ( BNODE(concat("completed_question_2_on_", str(?rvar382180))) = BNODE(concat("completed_question_2_on_", str(?rvar382182))) )
        }
        BIND(BNODE(concat("session_on_", str(?rvar382180))) AS ?_s)
        BIND(BNODE(concat("completed_question_2_on_", str(?rvar382180))) AS ?completedQ2)
        BIND(<https://server.solid-sandbox.vito.be/alice/profile/card#me> AS ?person)
      }
    UNION
      { { { { { { SELECT  ?rvar20386 ?rvar20382 ?rvar20387 ?rvar20385 ?rvar20383 ?rvar20384
                  WHERE
                    { ?rvar20384  <http://www.w3.org/ns/prov#atTime>  ?rvar20385 ;
                                <http://www.w3.org/ns/prov#wasAssociatedWith>  ?rvar20383 .
                      ?rvar20382  <https://w3id.org/survey-ontology#answeredIn>  ?rvar20384 ;
                                <https://w3id.org/survey-ontology#hasAnswer>  ?rvar20387 ;
                                <https://w3id.org/survey-ontology#completesQuestion>  ?rvar20386
                      FILTER ( ?rvar20386 IN (<https://vito.be/schema/ggdm#question1>, <https://vito.be/schema/ggdm#question2>, <https://vito.be/schema/ggdm#question3>, <https://vito.be/schema/ggdm#question4>, <https://vito.be/schema/ggdm#question5>, <https://vito.be/schema/ggdm#question6>, <https://vito.be/schema/ggdm#question6-1>, <https://vito.be/schema/ggdm#question6-2>, <https://vito.be/schema/ggdm#question7>, <https://vito.be/schema/ggdm#question7-1>, <https://vito.be/schema/ggdm#question7-2>, <https://vito.be/schema/ggdm#question7-3>, <https://vito.be/schema/ggdm#question7-4>, <https://vito.be/schema/ggdm#question7-5>, <https://vito.be/schema/ggdm#question7-6>, <https://vito.be/schema/ggdm#question7-7>, <https://vito.be/schema/ggdm#question7-8>, <https://vito.be/schema/ggdm#question7-9>, <https://vito.be/schema/ggdm#question7-10>, <https://vito.be/schema/ggdm#question8-1>, <https://vito.be/schema/ggdm#question9-1>, <https://vito.be/schema/ggdm#question10>, <https://vito.be/schema/ggdm#question11>, <https://vito.be/schema/ggdm#question12>, <https://vito.be/schema/ggdm#question13>, <https://vito.be/schema/ggdm#question14>) )
                    }
                }
                { SELECT  ?rvar20404 ?rvar20400 ?rvar20405 ?rvar20403 ?rvar20401 ?rvar20402
                  WHERE
                    { ?rvar20402  <http://www.w3.org/ns/prov#atTime>  ?rvar20403 ;
                                <http://www.w3.org/ns/prov#wasAssociatedWith>  ?rvar20401 .
                      ?rvar20400  <https://w3id.org/survey-ontology#answeredIn>  ?rvar20402 ;
                                <https://w3id.org/survey-ontology#hasAnswer>  ?rvar20405 ;
                                <https://w3id.org/survey-ontology#completesQuestion>  ?rvar20404
                      FILTER ( ?rvar20404 IN (<https://vito.be/schema/ggdm#question1>, <https://vito.be/schema/ggdm#question2>, <https://vito.be/schema/ggdm#question3>, <https://vito.be/schema/ggdm#question4>, <https://vito.be/schema/ggdm#question5>, <https://vito.be/schema/ggdm#question6>, <https://vito.be/schema/ggdm#question6-1>, <https://vito.be/schema/ggdm#question6-2>, <https://vito.be/schema/ggdm#question7>, <https://vito.be/schema/ggdm#question7-1>, <https://vito.be/schema/ggdm#question7-2>, <https://vito.be/schema/ggdm#question7-3>, <https://vito.be/schema/ggdm#question7-4>, <https://vito.be/schema/ggdm#question7-5>, <https://vito.be/schema/ggdm#question7-6>, <https://vito.be/schema/ggdm#question7-7>, <https://vito.be/schema/ggdm#question7-8>, <https://vito.be/schema/ggdm#question7-9>, <https://vito.be/schema/ggdm#question7-10>, <https://vito.be/schema/ggdm#question8-1>, <https://vito.be/schema/ggdm#question9-1>, <https://vito.be/schema/ggdm#question10>, <https://vito.be/schema/ggdm#question11>, <https://vito.be/schema/ggdm#question12>, <https://vito.be/schema/ggdm#question13>, <https://vito.be/schema/ggdm#question14>) )
                    }
                }
              }
              { SELECT  ?rvar20392 ?rvar20388 ?rvar20393 ?rvar20391 ?rvar20389 ?rvar20390
                WHERE
                  { ?rvar20390  <http://www.w3.org/ns/prov#atTime>  ?rvar20391 ;
                              <http://www.w3.org/ns/prov#wasAssociatedWith>  ?rvar20389 .
                    ?rvar20388  <https://w3id.org/survey-ontology#answeredIn>  ?rvar20390 ;
                              <https://w3id.org/survey-ontology#hasAnswer>  ?rvar20393 ;
                              <https://w3id.org/survey-ontology#completesQuestion>  ?rvar20392
                    FILTER ( ?rvar20392 IN (<https://vito.be/schema/ggdm#question1>, <https://vito.be/schema/ggdm#question2>, <https://vito.be/schema/ggdm#question3>, <https://vito.be/schema/ggdm#question4>, <https://vito.be/schema/ggdm#question5>, <https://vito.be/schema/ggdm#question6>, <https://vito.be/schema/ggdm#question6-1>, <https://vito.be/schema/ggdm#question6-2>, <https://vito.be/schema/ggdm#question7>, <https://vito.be/schema/ggdm#question7-1>, <https://vito.be/schema/ggdm#question7-2>, <https://vito.be/schema/ggdm#question7-3>, <https://vito.be/schema/ggdm#question7-4>, <https://vito.be/schema/ggdm#question7-5>, <https://vito.be/schema/ggdm#question7-6>, <https://vito.be/schema/ggdm#question7-7>, <https://vito.be/schema/ggdm#question7-8>, <https://vito.be/schema/ggdm#question7-9>, <https://vito.be/schema/ggdm#question7-10>, <https://vito.be/schema/ggdm#question8-1>, <https://vito.be/schema/ggdm#question9-1>, <https://vito.be/schema/ggdm#question10>, <https://vito.be/schema/ggdm#question11>, <https://vito.be/schema/ggdm#question12>, <https://vito.be/schema/ggdm#question13>, <https://vito.be/schema/ggdm#question14>) )
                  }
              }
            }
            { SELECT  ?rvar20398 ?rvar20394 ?rvar20399 ?rvar20397 ?rvar20395 ?rvar20396
              WHERE
                { ?rvar20396  <http://www.w3.org/ns/prov#atTime>  ?rvar20397 ;
                            <http://www.w3.org/ns/prov#wasAssociatedWith>  ?rvar20395 .
                  ?rvar20394  <https://w3id.org/survey-ontology#answeredIn>  ?rvar20396 ;
                            <https://w3id.org/survey-ontology#hasAnswer>  ?rvar20399 ;
                            <https://w3id.org/survey-ontology#completesQuestion>  ?rvar20398
                  FILTER ( ?rvar20398 IN (<https://vito.be/schema/ggdm#question1>, <https://vito.be/schema/ggdm#question2>, <https://vito.be/schema/ggdm#question3>, <https://vito.be/schema/ggdm#question4>, <https://vito.be/schema/ggdm#question5>, <https://vito.be/schema/ggdm#question6>, <https://vito.be/schema/ggdm#question6-1>, <https://vito.be/schema/ggdm#question6-2>, <https://vito.be/schema/ggdm#question7>, <https://vito.be/schema/ggdm#question7-1>, <https://vito.be/schema/ggdm#question7-2>, <https://vito.be/schema/ggdm#question7-3>, <https://vito.be/schema/ggdm#question7-4>, <https://vito.be/schema/ggdm#question7-5>, <https://vito.be/schema/ggdm#question7-6>, <https://vito.be/schema/ggdm#question7-7>, <https://vito.be/schema/ggdm#question7-8>, <https://vito.be/schema/ggdm#question7-9>, <https://vito.be/schema/ggdm#question7-10>, <https://vito.be/schema/ggdm#question8-1>, <https://vito.be/schema/ggdm#question9-1>, <https://vito.be/schema/ggdm#question10>, <https://vito.be/schema/ggdm#question11>, <https://vito.be/schema/ggdm#question12>, <https://vito.be/schema/ggdm#question13>, <https://vito.be/schema/ggdm#question14>) )
                }
            }
          }
          FILTER ( ?rvar20388 = ?rvar20400 )
          FILTER ( ?rvar20384 = ?rvar20396 )
          FILTER ( ?rvar20404 = <https://vito.be/schema/ggdm#question2> )
          FILTER ( ?rvar20393 = <https://vito.be/schema/ggdm#yes> )
          FILTER ( ?rvar20400 = ?rvar20394 )
        }
        BIND(?rvar20388 AS ?completedQ2)
        BIND(?rvar20383 AS ?person)
        BIND(?rvar20384 AS ?_s)
      }
    OPTIONAL
      { { { { SELECT  ?rvar1155966 ?rvar1155962 ?rvar1155967 ?rvar1155965 ?rvar1155963 ?rvar1155964
              WHERE
                { ?rvar1155964  <http://www.w3.org/ns/prov#atTime>  ?rvar1155965 ;
                            <http://www.w3.org/ns/prov#wasAssociatedWith>  ?rvar1155963 .
                  ?rvar1155962  <https://w3id.org/survey-ontology#answeredIn>  ?rvar1155964 ;
                            <https://w3id.org/survey-ontology#hasAnswer>  ?rvar1155967 ;
                            <https://w3id.org/survey-ontology#completesQuestion>  ?rvar1155966
                  FILTER ( ?rvar1155966 IN (<https://vito.be/schema/ggdm#question1>, <https://vito.be/schema/ggdm#question2>, <https://vito.be/schema/ggdm#question3>, <https://vito.be/schema/ggdm#question4>, <https://vito.be/schema/ggdm#question5>, <https://vito.be/schema/ggdm#question6>, <https://vito.be/schema/ggdm#question6-1>, <https://vito.be/schema/ggdm#question6-2>, <https://vito.be/schema/ggdm#question7>, <https://vito.be/schema/ggdm#question7-1>, <https://vito.be/schema/ggdm#question7-2>, <https://vito.be/schema/ggdm#question7-3>, <https://vito.be/schema/ggdm#question7-4>, <https://vito.be/schema/ggdm#question7-5>, <https://vito.be/schema/ggdm#question7-6>, <https://vito.be/schema/ggdm#question7-7>, <https://vito.be/schema/ggdm#question7-8>, <https://vito.be/schema/ggdm#question7-9>, <https://vito.be/schema/ggdm#question7-10>, <https://vito.be/schema/ggdm#question8-1>, <https://vito.be/schema/ggdm#question9-1>, <https://vito.be/schema/ggdm#question10>, <https://vito.be/schema/ggdm#question11>, <https://vito.be/schema/ggdm#question12>, <https://vito.be/schema/ggdm#question13>, <https://vito.be/schema/ggdm#question14>) )
                }
            }
            { SELECT  ?rvar1155960 ?rvar1155956 ?rvar1155961 ?rvar1155959 ?rvar1155957 ?rvar1155958
              WHERE
                { ?rvar1155958  <http://www.w3.org/ns/prov#atTime>  ?rvar1155959 ;
                            <http://www.w3.org/ns/prov#wasAssociatedWith>  ?rvar1155957 .
                  ?rvar1155956  <https://w3id.org/survey-ontology#answeredIn>  ?rvar1155958 ;
                            <https://w3id.org/survey-ontology#hasAnswer>  ?rvar1155961 ;
                            <https://w3id.org/survey-ontology#completesQuestion>  ?rvar1155960
                  FILTER ( ?rvar1155960 IN (<https://vito.be/schema/ggdm#question1>, <https://vito.be/schema/ggdm#question2>, <https://vito.be/schema/ggdm#question3>, <https://vito.be/schema/ggdm#question4>, <https://vito.be/schema/ggdm#question5>, <https://vito.be/schema/ggdm#question6>, <https://vito.be/schema/ggdm#question6-1>, <https://vito.be/schema/ggdm#question6-2>, <https://vito.be/schema/ggdm#question7>, <https://vito.be/schema/ggdm#question7-1>, <https://vito.be/schema/ggdm#question7-2>, <https://vito.be/schema/ggdm#question7-3>, <https://vito.be/schema/ggdm#question7-4>, <https://vito.be/schema/ggdm#question7-5>, <https://vito.be/schema/ggdm#question7-6>, <https://vito.be/schema/ggdm#question7-7>, <https://vito.be/schema/ggdm#question7-8>, <https://vito.be/schema/ggdm#question7-9>, <https://vito.be/schema/ggdm#question7-10>, <https://vito.be/schema/ggdm#question8-1>, <https://vito.be/schema/ggdm#question9-1>, <https://vito.be/schema/ggdm#question10>, <https://vito.be/schema/ggdm#question11>, <https://vito.be/schema/ggdm#question12>, <https://vito.be/schema/ggdm#question13>, <https://vito.be/schema/ggdm#question14>) )
                }
            }
          }
          FILTER ( ?rvar1155966 = <https://vito.be/schema/ggdm#question9-1> )
          FILTER ( ?rvar1155962 = ?rvar1155956 )
        }
        BIND(?rvar1155962 AS ?completedQ9_1)
        BIND(?rvar1155961 AS ?fruits)
      }
    OPTIONAL
      { { { { SELECT  ?rvar1158826 ?rvar1158822 ?rvar1158827 ?rvar1158825 ?rvar1158823 ?rvar1158824
              WHERE
                { ?rvar1158824  <http://www.w3.org/ns/prov#atTime>  ?rvar1158825 ;
                            <http://www.w3.org/ns/prov#wasAssociatedWith>  ?rvar1158823 .
                  ?rvar1158822  <https://w3id.org/survey-ontology#answeredIn>  ?rvar1158824 ;
                            <https://w3id.org/survey-ontology#hasAnswer>  ?rvar1158827 ;
                            <https://w3id.org/survey-ontology#completesQuestion>  ?rvar1158826
                  FILTER ( ?rvar1158826 IN (<https://vito.be/schema/ggdm#question1>, <https://vito.be/schema/ggdm#question2>, <https://vito.be/schema/ggdm#question3>, <https://vito.be/schema/ggdm#question4>, <https://vito.be/schema/ggdm#question5>, <https://vito.be/schema/ggdm#question6>, <https://vito.be/schema/ggdm#question6-1>, <https://vito.be/schema/ggdm#question6-2>, <https://vito.be/schema/ggdm#question7>, <https://vito.be/schema/ggdm#question7-1>, <https://vito.be/schema/ggdm#question7-2>, <https://vito.be/schema/ggdm#question7-3>, <https://vito.be/schema/ggdm#question7-4>, <https://vito.be/schema/ggdm#question7-5>, <https://vito.be/schema/ggdm#question7-6>, <https://vito.be/schema/ggdm#question7-7>, <https://vito.be/schema/ggdm#question7-8>, <https://vito.be/schema/ggdm#question7-9>, <https://vito.be/schema/ggdm#question7-10>, <https://vito.be/schema/ggdm#question8-1>, <https://vito.be/schema/ggdm#question9-1>, <https://vito.be/schema/ggdm#question10>, <https://vito.be/schema/ggdm#question11>, <https://vito.be/schema/ggdm#question12>, <https://vito.be/schema/ggdm#question13>, <https://vito.be/schema/ggdm#question14>) )
                }
            }
            { SELECT  ?rvar1158820 ?rvar1158816 ?rvar1158821 ?rvar1158819 ?rvar1158817 ?rvar1158818
              WHERE
                { ?rvar1158818  <http://www.w3.org/ns/prov#atTime>  ?rvar1158819 ;
                            <http://www.w3.org/ns/prov#wasAssociatedWith>  ?rvar1158817 .
                  ?rvar1158816  <https://w3id.org/survey-ontology#answeredIn>  ?rvar1158818 ;
                            <https://w3id.org/survey-ontology#hasAnswer>  ?rvar1158821 ;
                            <https://w3id.org/survey-ontology#completesQuestion>  ?rvar1158820
                  FILTER ( ?rvar1158820 IN (<https://vito.be/schema/ggdm#question1>, <https://vito.be/schema/ggdm#question2>, <https://vito.be/schema/ggdm#question3>, <https://vito.be/schema/ggdm#question4>, <https://vito.be/schema/ggdm#question5>, <https://vito.be/schema/ggdm#question6>, <https://vito.be/schema/ggdm#question6-1>, <https://vito.be/schema/ggdm#question6-2>, <https://vito.be/schema/ggdm#question7>, <https://vito.be/schema/ggdm#question7-1>, <https://vito.be/schema/ggdm#question7-2>, <https://vito.be/schema/ggdm#question7-3>, <https://vito.be/schema/ggdm#question7-4>, <https://vito.be/schema/ggdm#question7-5>, <https://vito.be/schema/ggdm#question7-6>, <https://vito.be/schema/ggdm#question7-7>, <https://vito.be/schema/ggdm#question7-8>, <https://vito.be/schema/ggdm#question7-9>, <https://vito.be/schema/ggdm#question7-10>, <https://vito.be/schema/ggdm#question8-1>, <https://vito.be/schema/ggdm#question9-1>, <https://vito.be/schema/ggdm#question10>, <https://vito.be/schema/ggdm#question11>, <https://vito.be/schema/ggdm#question12>, <https://vito.be/schema/ggdm#question13>, <https://vito.be/schema/ggdm#question14>) )
                }
            }
          }
          FILTER ( ?rvar1158826 = <https://vito.be/schema/ggdm#question10> )
          FILTER ( ?rvar1158822 = ?rvar1158816 )
        }
        BIND(?rvar1158821 AS ?exercise)
        BIND(?rvar1158822 AS ?completedQ10)
      }
    OPTIONAL
      { { SELECT  ?rvar1161239 ?rvar1161240 ?rvar1161242 ?rvar1161243 ?rvar1161236 ?rvar1161237 ?rvar1161241 ?rvar1161238 ?rvar1161244
          WHERE
            { ?rvar1161239  <http://xmlns.com/foaf/0.1/givenName>  ?rvar1161240 ;
                        <http://xmlns.com/foaf/0.1/familyName>  ?rvar1161242 ;
                        <http://xmlns.com/foaf/0.1/age>  ?rvar1161243 ;
                        <http://xmlns.com/foaf/0.1/gender>  ?gender ;
                        <https://vito.be/schema/ggdm#parameterCholesterolHDL>  ?rvar1161236 ;
                        <https://vito.be/schema/ggdm#parameterCholesterolRatio>  ?rvar1161237 ;
                        <https://vito.be/schema/ggdm#parameterCholesterolTotal>  ?rvar1161241 ;
                        <https://vito.be/schema/ggdm#parameterLength>  ?rvar1161238 ;
                        <https://vito.be/schema/ggdm#parameterWeight>  ?rvar1161244
            }
        }
        BIND(?rvar1161239 AS ?person)
        BIND(?rvar1161243 AS ?age)
      }
  }`;
exports.query2 = `SELECT  (COUNT(DISTINCT ?completedQuestion) AS ?count)
WHERE
  {   { { SELECT  (if(bound(?fhirConditionOnsetDateTimeValue), <https://vito.be/schema/ggdm#yes>, <https://vito.be/schema/ggdm#no>) AS ?rvar33) (if(bound(?fhirConditionOnsetDateTimeValue), ?fhirConditionOnsetDateTimeValue, concat(str(day(now())), "-", str(month(now())), "-", str(year(now())))) AS ?rvar32)
          WHERE
            { OPTIONAL
                { ?c    a                     <http://hl7.org/fhir/Condition> ;
                        <http://hl7.org/fhir/Condition.code>  _:b0 .
                  _:b0  <http://hl7.org/fhir/CodeableConcept.coding>  _:b1 .
                  _:b1  a                     ?fhirConditionCodingClass ;
                        <http://hl7.org/fhir/Coding.system>  _:b2 .
                  _:b2  <http://hl7.org/fhir/value>  ?fhirConditionCodingSystemValue .
                  _:b1  <http://hl7.org/fhir/Coding.code>  _:b3 .
                  _:b3  <http://hl7.org/fhir/value>  "73211009" .
                  _:b1  <http://hl7.org/fhir/Coding.display>  _:b4 .
                  _:b4  <http://hl7.org/fhir/value>  ?fhirConditionCodingDisplayValue .
                  ?c    <http://hl7.org/fhir/Condition.subject>  _:b5 .
                  _:b5  <http://hl7.org/fhir/link>  ?fhirConditionSubjectLink .
                  ?c    <http://hl7.org/fhir/Condition.onsetDateTime>  _:b6 .
                  _:b6  <http://hl7.org/fhir/value>  ?fhirConditionOnsetDateTimeValue
                }
            }
        }
        BIND(BNODE(concat("completed_question_2_on_", str(?rvar32))) AS ?completedQuestion)
        BIND(BNODE(concat("session_on_", str(?rvar32))) AS ?session)
      }
    UNION
      { { SELECT  ?rvar16 ?rvar12 ?rvar17 ?rvar15 ?rvar13 ?rvar14
          WHERE
            { ?rvar14  <http://www.w3.org/ns/prov#atTime>  ?rvar15 ;
                       <http://www.w3.org/ns/prov#wasAssociatedWith>  ?rvar13 .
              ?rvar12  <https://w3id.org/survey-ontology#answeredIn>  ?rvar14 ;
                       <https://w3id.org/survey-ontology#hasAnswer>  ?rvar17 ;
                       <https://w3id.org/survey-ontology#completesQuestion>  ?rvar16
              FILTER ( ?rvar16 IN (<https://vito.be/schema/ggdm#question1>, <https://vito.be/schema/ggdm#question2>, <https://vito.be/schema/ggdm#question3>, <https://vito.be/schema/ggdm#question4>, <https://vito.be/schema/ggdm#question5>, <https://vito.be/schema/ggdm#question6>, <https://vito.be/schema/ggdm#question6-1>, <https://vito.be/schema/ggdm#question6-2>, <https://vito.be/schema/ggdm#question7>, <https://vito.be/schema/ggdm#question7-1>, <https://vito.be/schema/ggdm#question7-2>, <https://vito.be/schema/ggdm#question7-3>, <https://vito.be/schema/ggdm#question7-4>, <https://vito.be/schema/ggdm#question7-5>, <https://vito.be/schema/ggdm#question7-6>, <https://vito.be/schema/ggdm#question7-7>, <https://vito.be/schema/ggdm#question7-8>, <https://vito.be/schema/ggdm#question7-9>, <https://vito.be/schema/ggdm#question7-10>, <https://vito.be/schema/ggdm#question8-1>, <https://vito.be/schema/ggdm#question9-1>, <https://vito.be/schema/ggdm#question10>, <https://vito.be/schema/ggdm#question11>, <https://vito.be/schema/ggdm#question12>, <https://vito.be/schema/ggdm#question13>, <https://vito.be/schema/ggdm#question14>) )
            }
        }
        BIND(?rvar12 AS ?completedQuestion)
        BIND(?rvar14 AS ?session)
      }
  }`;
