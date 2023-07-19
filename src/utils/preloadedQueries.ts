
export const query1 = `SELECT  ?age ?fruits ?exercise
WHERE
  {   { { { { { { SELECT  (if(bound(?fhirConditionOnsetDateTimeValue), <https://vito.be/schema/ggdm#yes>, <https://vito.be/schema/ggdm#no>) AS ?rvar83997) (if(bound(?fhirConditionOnsetDateTimeValue), ?fhirConditionOnsetDateTimeValue, concat(str(day(now())), "-", str(month(now())), "-", str(year(now())))) AS ?rvar83996)
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
                { SELECT  (if(bound(?fhirConditionOnsetDateTimeValue), <https://vito.be/schema/ggdm#yes>, <https://vito.be/schema/ggdm#no>) AS ?rvar83999) (if(bound(?fhirConditionOnsetDateTimeValue), ?fhirConditionOnsetDateTimeValue, concat(str(day(now())), "-", str(month(now())), "-", str(year(now())))) AS ?rvar83998)
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
              { SELECT  (if(bound(?fhirConditionOnsetDateTimeValue), <https://vito.be/schema/ggdm#yes>, <https://vito.be/schema/ggdm#no>) AS ?rvar84001) (if(bound(?fhirConditionOnsetDateTimeValue), ?fhirConditionOnsetDateTimeValue, concat(str(day(now())), "-", str(month(now())), "-", str(year(now())))) AS ?rvar84000)
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
            { SELECT  (if(bound(?fhirConditionOnsetDateTimeValue), <https://vito.be/schema/ggdm#yes>, <https://vito.be/schema/ggdm#no>) AS ?rvar83995) (if(bound(?fhirConditionOnsetDateTimeValue), ?fhirConditionOnsetDateTimeValue, concat(str(day(now())), "-", str(month(now())), "-", str(year(now())))) AS ?rvar83994)
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
          FILTER ( BNODE(concat("completed_question_2_on_", str(?rvar84000))) = BNODE(concat("completed_question_2_on_", str(?rvar83998))) )
          FILTER ( BNODE(concat("completed_question_2_on_", str(?rvar83996))) = BNODE(concat("completed_question_2_on_", str(?rvar84000))) )
          FILTER ( BNODE(concat("session_on_", str(?rvar83998))) = BNODE(concat("session_on_", str(?rvar83994))) )
          FILTER ( ?rvar83997 = <https://vito.be/schema/ggdm#yes> )
        }
        BIND(BNODE(concat("completed_question_2_on_", str(?rvar83996))) AS ?completedQ2)
        BIND(BNODE(concat("session_on_", str(?rvar83998))) AS ?_s)
        BIND(<https://server.solid-sandbox.vito.be/alice/profile/card#me> AS ?person)
      }
    UNION
      { { { { { { SELECT  ?rvar222208 ?rvar222204 ?rvar222209 ?rvar222207 ?rvar222205 ?rvar222206
                  WHERE
                    { ?rvar222206  <http://www.w3.org/ns/prov#atTime>  ?rvar222207 ;
                                <http://www.w3.org/ns/prov#wasAssociatedWith>  ?rvar222205 .
                      ?rvar222204  <https://w3id.org/survey-ontology#answeredIn>  ?rvar222206 ;
                                <https://w3id.org/survey-ontology#hasAnswer>  ?rvar222209 ;
                                <https://w3id.org/survey-ontology#completesQuestion>  ?rvar222208
                      FILTER ( ?rvar222208 IN (<https://vito.be/schema/ggdm#question1>, <https://vito.be/schema/ggdm#question2>, <https://vito.be/schema/ggdm#question3>, <https://vito.be/schema/ggdm#question4>, <https://vito.be/schema/ggdm#question5>, <https://vito.be/schema/ggdm#question6>, <https://vito.be/schema/ggdm#question6-1>, <https://vito.be/schema/ggdm#question6-2>, <https://vito.be/schema/ggdm#question7>, <https://vito.be/schema/ggdm#question7-1>, <https://vito.be/schema/ggdm#question7-2>, <https://vito.be/schema/ggdm#question7-3>, <https://vito.be/schema/ggdm#question7-4>, <https://vito.be/schema/ggdm#question7-5>, <https://vito.be/schema/ggdm#question7-6>, <https://vito.be/schema/ggdm#question7-7>, <https://vito.be/schema/ggdm#question7-8>, <https://vito.be/schema/ggdm#question7-9>, <https://vito.be/schema/ggdm#question7-10>, <https://vito.be/schema/ggdm#question8-1>, <https://vito.be/schema/ggdm#question9-1>, <https://vito.be/schema/ggdm#question10>, <https://vito.be/schema/ggdm#question11>, <https://vito.be/schema/ggdm#question12>, <https://vito.be/schema/ggdm#question13>, <https://vito.be/schema/ggdm#question14>) )
                    }
                }
                { SELECT  ?rvar222220 ?rvar222216 ?rvar222221 ?rvar222219 ?rvar222217 ?rvar222218
                  WHERE
                    { ?rvar222218  <http://www.w3.org/ns/prov#atTime>  ?rvar222219 ;
                                <http://www.w3.org/ns/prov#wasAssociatedWith>  ?rvar222217 .
                      ?rvar222216  <https://w3id.org/survey-ontology#answeredIn>  ?rvar222218 ;
                                <https://w3id.org/survey-ontology#hasAnswer>  ?rvar222221 ;
                                <https://w3id.org/survey-ontology#completesQuestion>  ?rvar222220
                      FILTER ( ?rvar222220 IN (<https://vito.be/schema/ggdm#question1>, <https://vito.be/schema/ggdm#question2>, <https://vito.be/schema/ggdm#question3>, <https://vito.be/schema/ggdm#question4>, <https://vito.be/schema/ggdm#question5>, <https://vito.be/schema/ggdm#question6>, <https://vito.be/schema/ggdm#question6-1>, <https://vito.be/schema/ggdm#question6-2>, <https://vito.be/schema/ggdm#question7>, <https://vito.be/schema/ggdm#question7-1>, <https://vito.be/schema/ggdm#question7-2>, <https://vito.be/schema/ggdm#question7-3>, <https://vito.be/schema/ggdm#question7-4>, <https://vito.be/schema/ggdm#question7-5>, <https://vito.be/schema/ggdm#question7-6>, <https://vito.be/schema/ggdm#question7-7>, <https://vito.be/schema/ggdm#question7-8>, <https://vito.be/schema/ggdm#question7-9>, <https://vito.be/schema/ggdm#question7-10>, <https://vito.be/schema/ggdm#question8-1>, <https://vito.be/schema/ggdm#question9-1>, <https://vito.be/schema/ggdm#question10>, <https://vito.be/schema/ggdm#question11>, <https://vito.be/schema/ggdm#question12>, <https://vito.be/schema/ggdm#question13>, <https://vito.be/schema/ggdm#question14>) )
                    }
                }
              }
              { SELECT  ?rvar222202 ?rvar222198 ?rvar222203 ?rvar222201 ?rvar222199 ?rvar222200
                WHERE
                  { ?rvar222200  <http://www.w3.org/ns/prov#atTime>  ?rvar222201 ;
                              <http://www.w3.org/ns/prov#wasAssociatedWith>  ?rvar222199 .
                    ?rvar222198  <https://w3id.org/survey-ontology#answeredIn>  ?rvar222200 ;
                              <https://w3id.org/survey-ontology#hasAnswer>  ?rvar222203 ;
                              <https://w3id.org/survey-ontology#completesQuestion>  ?rvar222202
                    FILTER ( ?rvar222202 IN (<https://vito.be/schema/ggdm#question1>, <https://vito.be/schema/ggdm#question2>, <https://vito.be/schema/ggdm#question3>, <https://vito.be/schema/ggdm#question4>, <https://vito.be/schema/ggdm#question5>, <https://vito.be/schema/ggdm#question6>, <https://vito.be/schema/ggdm#question6-1>, <https://vito.be/schema/ggdm#question6-2>, <https://vito.be/schema/ggdm#question7>, <https://vito.be/schema/ggdm#question7-1>, <https://vito.be/schema/ggdm#question7-2>, <https://vito.be/schema/ggdm#question7-3>, <https://vito.be/schema/ggdm#question7-4>, <https://vito.be/schema/ggdm#question7-5>, <https://vito.be/schema/ggdm#question7-6>, <https://vito.be/schema/ggdm#question7-7>, <https://vito.be/schema/ggdm#question7-8>, <https://vito.be/schema/ggdm#question7-9>, <https://vito.be/schema/ggdm#question7-10>, <https://vito.be/schema/ggdm#question8-1>, <https://vito.be/schema/ggdm#question9-1>, <https://vito.be/schema/ggdm#question10>, <https://vito.be/schema/ggdm#question11>, <https://vito.be/schema/ggdm#question12>, <https://vito.be/schema/ggdm#question13>, <https://vito.be/schema/ggdm#question14>) )
                  }
              }
            }
            { SELECT  ?rvar222214 ?rvar222210 ?rvar222215 ?rvar222213 ?rvar222211 ?rvar222212
              WHERE
                { ?rvar222212  <http://www.w3.org/ns/prov#atTime>  ?rvar222213 ;
                            <http://www.w3.org/ns/prov#wasAssociatedWith>  ?rvar222211 .
                  ?rvar222210  <https://w3id.org/survey-ontology#answeredIn>  ?rvar222212 ;
                            <https://w3id.org/survey-ontology#hasAnswer>  ?rvar222215 ;
                            <https://w3id.org/survey-ontology#completesQuestion>  ?rvar222214
                  FILTER ( ?rvar222214 IN (<https://vito.be/schema/ggdm#question1>, <https://vito.be/schema/ggdm#question2>, <https://vito.be/schema/ggdm#question3>, <https://vito.be/schema/ggdm#question4>, <https://vito.be/schema/ggdm#question5>, <https://vito.be/schema/ggdm#question6>, <https://vito.be/schema/ggdm#question6-1>, <https://vito.be/schema/ggdm#question6-2>, <https://vito.be/schema/ggdm#question7>, <https://vito.be/schema/ggdm#question7-1>, <https://vito.be/schema/ggdm#question7-2>, <https://vito.be/schema/ggdm#question7-3>, <https://vito.be/schema/ggdm#question7-4>, <https://vito.be/schema/ggdm#question7-5>, <https://vito.be/schema/ggdm#question7-6>, <https://vito.be/schema/ggdm#question7-7>, <https://vito.be/schema/ggdm#question7-8>, <https://vito.be/schema/ggdm#question7-9>, <https://vito.be/schema/ggdm#question7-10>, <https://vito.be/schema/ggdm#question8-1>, <https://vito.be/schema/ggdm#question9-1>, <https://vito.be/schema/ggdm#question10>, <https://vito.be/schema/ggdm#question11>, <https://vito.be/schema/ggdm#question12>, <https://vito.be/schema/ggdm#question13>, <https://vito.be/schema/ggdm#question14>) )
                }
            }
          }
          FILTER ( ?rvar222220 = <https://vito.be/schema/ggdm#question2> )
          FILTER ( ?rvar222212 = ?rvar222200 )
          FILTER ( ?rvar222216 = ?rvar222204 )
          FILTER ( ?rvar222209 = <https://vito.be/schema/ggdm#yes> )
          FILTER ( ?rvar222210 = ?rvar222216 )
        }
        BIND(?rvar222212 AS ?_s)
        BIND(?rvar222210 AS ?completedQ2)
        BIND(<https://server.solid-sandbox.vito.be/alice/profile/card#me> AS ?person)
      }
    OPTIONAL
      { { { { SELECT  ?rvar234208 ?rvar234204 ?rvar234209 ?rvar234207 ?rvar234205 ?rvar234206
              WHERE
                { ?rvar234206  <http://www.w3.org/ns/prov#atTime>  ?rvar234207 ;
                            <http://www.w3.org/ns/prov#wasAssociatedWith>  ?rvar234205 .
                  ?rvar234204  <https://w3id.org/survey-ontology#answeredIn>  ?rvar234206 ;
                            <https://w3id.org/survey-ontology#hasAnswer>  ?rvar234209 ;
                            <https://w3id.org/survey-ontology#completesQuestion>  ?rvar234208
                  FILTER ( ?rvar234208 IN (<https://vito.be/schema/ggdm#question1>, <https://vito.be/schema/ggdm#question2>, <https://vito.be/schema/ggdm#question3>, <https://vito.be/schema/ggdm#question4>, <https://vito.be/schema/ggdm#question5>, <https://vito.be/schema/ggdm#question6>, <https://vito.be/schema/ggdm#question6-1>, <https://vito.be/schema/ggdm#question6-2>, <https://vito.be/schema/ggdm#question7>, <https://vito.be/schema/ggdm#question7-1>, <https://vito.be/schema/ggdm#question7-2>, <https://vito.be/schema/ggdm#question7-3>, <https://vito.be/schema/ggdm#question7-4>, <https://vito.be/schema/ggdm#question7-5>, <https://vito.be/schema/ggdm#question7-6>, <https://vito.be/schema/ggdm#question7-7>, <https://vito.be/schema/ggdm#question7-8>, <https://vito.be/schema/ggdm#question7-9>, <https://vito.be/schema/ggdm#question7-10>, <https://vito.be/schema/ggdm#question8-1>, <https://vito.be/schema/ggdm#question9-1>, <https://vito.be/schema/ggdm#question10>, <https://vito.be/schema/ggdm#question11>, <https://vito.be/schema/ggdm#question12>, <https://vito.be/schema/ggdm#question13>, <https://vito.be/schema/ggdm#question14>) )
                }
            }
            { SELECT  ?rvar234214 ?rvar234210 ?rvar234215 ?rvar234213 ?rvar234211 ?rvar234212
              WHERE
                { ?rvar234212  <http://www.w3.org/ns/prov#atTime>  ?rvar234213 ;
                            <http://www.w3.org/ns/prov#wasAssociatedWith>  ?rvar234211 .
                  ?rvar234210  <https://w3id.org/survey-ontology#answeredIn>  ?rvar234212 ;
                            <https://w3id.org/survey-ontology#hasAnswer>  ?rvar234215 ;
                            <https://w3id.org/survey-ontology#completesQuestion>  ?rvar234214
                  FILTER ( ?rvar234214 IN (<https://vito.be/schema/ggdm#question1>, <https://vito.be/schema/ggdm#question2>, <https://vito.be/schema/ggdm#question3>, <https://vito.be/schema/ggdm#question4>, <https://vito.be/schema/ggdm#question5>, <https://vito.be/schema/ggdm#question6>, <https://vito.be/schema/ggdm#question6-1>, <https://vito.be/schema/ggdm#question6-2>, <https://vito.be/schema/ggdm#question7>, <https://vito.be/schema/ggdm#question7-1>, <https://vito.be/schema/ggdm#question7-2>, <https://vito.be/schema/ggdm#question7-3>, <https://vito.be/schema/ggdm#question7-4>, <https://vito.be/schema/ggdm#question7-5>, <https://vito.be/schema/ggdm#question7-6>, <https://vito.be/schema/ggdm#question7-7>, <https://vito.be/schema/ggdm#question7-8>, <https://vito.be/schema/ggdm#question7-9>, <https://vito.be/schema/ggdm#question7-10>, <https://vito.be/schema/ggdm#question8-1>, <https://vito.be/schema/ggdm#question9-1>, <https://vito.be/schema/ggdm#question10>, <https://vito.be/schema/ggdm#question11>, <https://vito.be/schema/ggdm#question12>, <https://vito.be/schema/ggdm#question13>, <https://vito.be/schema/ggdm#question14>) )
                }
            }
          }
          FILTER ( ?rvar234214 = <https://vito.be/schema/ggdm#question9-1> )
          FILTER ( ?rvar234210 = ?rvar234204 )
        }
        BIND(?rvar234209 AS ?fruits)
        BIND(?rvar234210 AS ?completedQ9_1)
      }
    OPTIONAL
      { { { { SELECT  ?rvar235228 ?rvar235224 ?rvar235229 ?rvar235227 ?rvar235225 ?rvar235226
              WHERE
                { ?rvar235226  <http://www.w3.org/ns/prov#atTime>  ?rvar235227 ;
                            <http://www.w3.org/ns/prov#wasAssociatedWith>  ?rvar235225 .
                  ?rvar235224  <https://w3id.org/survey-ontology#answeredIn>  ?rvar235226 ;
                            <https://w3id.org/survey-ontology#hasAnswer>  ?rvar235229 ;
                            <https://w3id.org/survey-ontology#completesQuestion>  ?rvar235228
                  FILTER ( ?rvar235228 IN (<https://vito.be/schema/ggdm#question1>, <https://vito.be/schema/ggdm#question2>, <https://vito.be/schema/ggdm#question3>, <https://vito.be/schema/ggdm#question4>, <https://vito.be/schema/ggdm#question5>, <https://vito.be/schema/ggdm#question6>, <https://vito.be/schema/ggdm#question6-1>, <https://vito.be/schema/ggdm#question6-2>, <https://vito.be/schema/ggdm#question7>, <https://vito.be/schema/ggdm#question7-1>, <https://vito.be/schema/ggdm#question7-2>, <https://vito.be/schema/ggdm#question7-3>, <https://vito.be/schema/ggdm#question7-4>, <https://vito.be/schema/ggdm#question7-5>, <https://vito.be/schema/ggdm#question7-6>, <https://vito.be/schema/ggdm#question7-7>, <https://vito.be/schema/ggdm#question7-8>, <https://vito.be/schema/ggdm#question7-9>, <https://vito.be/schema/ggdm#question7-10>, <https://vito.be/schema/ggdm#question8-1>, <https://vito.be/schema/ggdm#question9-1>, <https://vito.be/schema/ggdm#question10>, <https://vito.be/schema/ggdm#question11>, <https://vito.be/schema/ggdm#question12>, <https://vito.be/schema/ggdm#question13>, <https://vito.be/schema/ggdm#question14>) )
                }
            }
            { SELECT  ?rvar235234 ?rvar235230 ?rvar235235 ?rvar235233 ?rvar235231 ?rvar235232
              WHERE
                { ?rvar235232  <http://www.w3.org/ns/prov#atTime>  ?rvar235233 ;
                            <http://www.w3.org/ns/prov#wasAssociatedWith>  ?rvar235231 .
                  ?rvar235230  <https://w3id.org/survey-ontology#answeredIn>  ?rvar235232 ;
                            <https://w3id.org/survey-ontology#hasAnswer>  ?rvar235235 ;
                            <https://w3id.org/survey-ontology#completesQuestion>  ?rvar235234
                  FILTER ( ?rvar235234 IN (<https://vito.be/schema/ggdm#question1>, <https://vito.be/schema/ggdm#question2>, <https://vito.be/schema/ggdm#question3>, <https://vito.be/schema/ggdm#question4>, <https://vito.be/schema/ggdm#question5>, <https://vito.be/schema/ggdm#question6>, <https://vito.be/schema/ggdm#question6-1>, <https://vito.be/schema/ggdm#question6-2>, <https://vito.be/schema/ggdm#question7>, <https://vito.be/schema/ggdm#question7-1>, <https://vito.be/schema/ggdm#question7-2>, <https://vito.be/schema/ggdm#question7-3>, <https://vito.be/schema/ggdm#question7-4>, <https://vito.be/schema/ggdm#question7-5>, <https://vito.be/schema/ggdm#question7-6>, <https://vito.be/schema/ggdm#question7-7>, <https://vito.be/schema/ggdm#question7-8>, <https://vito.be/schema/ggdm#question7-9>, <https://vito.be/schema/ggdm#question7-10>, <https://vito.be/schema/ggdm#question8-1>, <https://vito.be/schema/ggdm#question9-1>, <https://vito.be/schema/ggdm#question10>, <https://vito.be/schema/ggdm#question11>, <https://vito.be/schema/ggdm#question12>, <https://vito.be/schema/ggdm#question13>, <https://vito.be/schema/ggdm#question14>) )
                }
            }
          }
          FILTER ( ?rvar235234 = <https://vito.be/schema/ggdm#question10> )
          FILTER ( ?rvar235230 = ?rvar235224 )
        }
        BIND(?rvar235229 AS ?exercise)
        BIND(?rvar235230 AS ?completedQ10)
      }
    OPTIONAL
      { { SELECT  ?rvar235632 ?rvar235633 ?rvar235634 ?rvar235635
          WHERE
            { ?rvar235632  <http://xmlns.com/foaf/0.1/givenName>  ?rvar235633 ;
                        <http://xmlns.com/foaf/0.1/familyName>  ?rvar235634 ;
                        <http://xmlns.com/foaf/0.1/age>  ?rvar235635 ;
                        <http://xmlns.com/foaf/0.1/gender>  ?gender
            }
        }
        BIND(?rvar235632 AS ?person)
        BIND(?rvar235635 AS ?age)
      }
  }
`;

export const query2 = `SELECT  (COUNT(DISTINCT ?completedQuestion) AS ?count)
WHERE
  {   { { SELECT  (if(bound(?fhirConditionOnsetDateTimeValue), <https://vito.be/schema/ggdm#yes>, <https://vito.be/schema/ggdm#no>) AS ?rvar27) (if(bound(?fhirConditionOnsetDateTimeValue), ?fhirConditionOnsetDateTimeValue, concat(str(day(now())), "-", str(month(now())), "-", str(year(now())))) AS ?rvar26)
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
        BIND(BNODE(concat("session_on_", str(?rvar26))) AS ?session)
        BIND(BNODE(concat("completed_question_2_on_", str(?rvar26))) AS ?completedQuestion)
      }
    UNION
      { { SELECT  ?rvar40 ?rvar36 ?rvar41 ?rvar39 ?rvar37 ?rvar38
          WHERE
            { ?rvar38  <http://www.w3.org/ns/prov#atTime>  ?rvar39 ;
                       <http://www.w3.org/ns/prov#wasAssociatedWith>  ?rvar37 .
              ?rvar36  <https://w3id.org/survey-ontology#answeredIn>  ?rvar38 ;
                       <https://w3id.org/survey-ontology#hasAnswer>  ?rvar41 ;
                       <https://w3id.org/survey-ontology#completesQuestion>  ?rvar40
              FILTER ( ?rvar40 IN (<https://vito.be/schema/ggdm#question1>, <https://vito.be/schema/ggdm#question2>, <https://vito.be/schema/ggdm#question3>, <https://vito.be/schema/ggdm#question4>, <https://vito.be/schema/ggdm#question5>, <https://vito.be/schema/ggdm#question6>, <https://vito.be/schema/ggdm#question6-1>, <https://vito.be/schema/ggdm#question6-2>, <https://vito.be/schema/ggdm#question7>, <https://vito.be/schema/ggdm#question7-1>, <https://vito.be/schema/ggdm#question7-2>, <https://vito.be/schema/ggdm#question7-3>, <https://vito.be/schema/ggdm#question7-4>, <https://vito.be/schema/ggdm#question7-5>, <https://vito.be/schema/ggdm#question7-6>, <https://vito.be/schema/ggdm#question7-7>, <https://vito.be/schema/ggdm#question7-8>, <https://vito.be/schema/ggdm#question7-9>, <https://vito.be/schema/ggdm#question7-10>, <https://vito.be/schema/ggdm#question8-1>, <https://vito.be/schema/ggdm#question9-1>, <https://vito.be/schema/ggdm#question10>, <https://vito.be/schema/ggdm#question11>, <https://vito.be/schema/ggdm#question12>, <https://vito.be/schema/ggdm#question13>, <https://vito.be/schema/ggdm#question14>) )
            }
        }
        BIND(?rvar38 AS ?session)
        BIND(?rvar36 AS ?completedQuestion)
      }
  }`;
