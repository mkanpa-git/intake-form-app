import React, { useState, useEffect } from "react";
import { IMaskInput } from 'react-imask';
import ReactMarkdown from "react-markdown";
import { evaluateCondition, validateStep, cleanupHiddenFields } from "../utils/formHelpers";

export default function FormComponent() {
  const form = JSON.parse(`{
  "title": "Childcare Application Wizard",
  "description": "Step-by-step form for applying for Childcare Assistance",
  "layout": {
    "stepperPosition": "top"
  },
  "steps": [
    {
      "id": "consent_step",
      "title": "Consent",
      "sections": [
        {
          "id": "mycity_consent_info",
          "title": "MyCity Consent",
          "type": "info",  
          "ui": { "markdown": true, "collapsible": false, "defaultCollapsed": false }, 
          "content": 
            "In connection with this application for child care services, **MyCity**:\\n\\n- Collects, processes, stores, and shares the information you submit to screen you when you apply for child care services;\\n- Receives, processes, and stores the information the City already knows about you to screen you when you apply for child care services;\\n- Uses your information to improve MyCity; and\\n- Communicates with you about your MyCity account.\\n\\n---\\n\\nIf you consent, the following information may be shared between child care services agencies:\\n\\n- Demographic and background information, including address, phone number, household composition.\\n- Housing information, including benefits awarded/received, current housing/shelter status.\\n- Benefits information, including public assistance awarded/received, child care program participation.\\n\\n---\\n\\nIf you choose not to consent, **you will not be denied** any benefits or services you are receiving or any benefits for which you are eligible.\\n\\nThe [MyCity Privacy Policy](https://www.nyc.gov/privacy) details how MyCity handles the information you submit through MyCity."
        }
      ]
    },
    {
      "id": "instructions_step",
      "title": "Instructions",
      "sections": [
        {
          "id": "application_instructions",
          "title": "Application Instructions",
          "type": "info",  
          "ui": { "markdown": true, "collapsible": false, "defaultCollapsed": false},
          "content": "**Let’s get started on your application!**\\n\\nTo complete this application, you will be asked for information about:\\n\\n- Yourself\\n- Your household\\n- Your employment or reason for care\\n- Your income\\n\\nAll required fields are marked and must be filled out to move forward with the application. The pages of the application are shown on the right-hand side of the screen and will be highlighted as you move through the application.\\n\\nYour application will be saved automatically as you progress to each page.  \\nIf you need to pause at any time, click the **“Save for later”** button at the bottom of each page to save your application.  \\nYou can log back in to resume your application.\\n\\nWhen you’re ready to begin, click **“Next”** below.\\n\\n---\\n\\n⚠️ **Important:**  \\nTo keep your information current and safe, applications in draft status that you have not edited for **30 days** will be deleted.  \\nIf your draft application is deleted, you can still create and submit a new application when you're ready to apply."
        },
        {
          "id": "new_york_city_residency",
          "title": "New York City Residency",
          "type": "info",  
          "ui": { "markdown": true, "collapsible": true, "defaultCollapsed": true},
          "content": "You will need to upload **ONE** of the following documents to confirm your NYC residency:\\n\\n- IDNYC\\n- Driver’s License\\n- Utility Bill (dated within the last 60 days, with your address)\\n- Current lease, rent, or mortgage statement (dated within the last 60 days, with your address)\\n- Section 8 Award Letter\\n- NYCHA Certificate\\n- CFWB-027 Housing Attestation with address listed\\n- Shelter Residency Letter with address listed\\n\\nIf you do not have any of those documents, you must submit a **CFWB-067 Residency Attestation**."
        },   
        {
          "id": "children_documents",
          "title": "Children Documents",
          "type": "info",  
          "ui": { "markdown": true, "collapsible": true, "defaultCollapsed": true},
          "content": "### Citizenship or Immigration Status\\nThese documents confirm the citizenship or immigration status of the children in your family for whom you’re applying for child care assistance. Please upload one of the following documents for each child needing care. *Do not upload these documents for children who do not need care.*\\n\\n- Birth Certificate from US state or territory\\n- Alien Registration Card including Permanent Resident or Green Card\\n- Passport\\n- FS-240 (Consular Report of Birth Abroad)\\n- Naturalization Certificate\\n- Other documentation that proves child’s immigration status\\n\\n### Child's Relationship to Applicant\\nThese documents confirm your relationship to the children in your household under age 18. Please upload one of the following documents for every child in the household under age 18, regardless of whether they need child care.\\n\\n- Birth certificate\\n- Adoption record\\n- Baptismal record\\n- Passport with parent's signature\\n- Court order for legal guardian with financial responsibility\\n- Letter of guardianship\\n- Other - CFWB-058 Caretaker Attestation\\n\\nIf you are not the child's parent or stepparent, you must submit a **CFWB-058 Caretaker Attestation Form**.\\n\\n### Age of Children\\nYou will need to upload **ONE** of the following documents for every child in the household under age 18, regardless of whether child care is needed for them:\\n\\n- Birth certificate\\n- Adoption record\\n- Baptismal record\\n- Alien Registration Card\\n- Passport\\n- Official hospital documentation of the child’s birth"
        },     
        {
          "id": "employment_income",
          "title": "Employment & Income",
          "type": "info",  
          "ui": { "markdown": true, "collapsible": true, "defaultCollapsed": true },
          "content": "### Income\\nThese documents confirm your family’s income.\\n\\n---\\n\\n### If You Are Employed\\nIf you are employed and receive paystubs, you must submit them to confirm your income. The number of paystubs you must submit varies by how often you get paid and whether your payment amount is the same or different each time you are paid – see the table below for details. Submit the most recent paystub you have received, followed by others in consecutive order.\\n\\n**Income Information**\\n\\n| How Often Do You Get Paid? | Always the SAME Amount | DIFFERENT Amounts Each Time |\\n|----------------------------|-------------------------|------------------------------|\\n| Weekly (Every Week) | 4 most recent, consecutive pay stubs | 12 most recent, consecutive pay stubs |\\n| Bi-Weekly (Every Two Weeks) | 2 most recent, consecutive pay stubs | 6 most recent, consecutive pay stubs |\\n| Semi-Monthly (Two Times Per Month) | 2 most recent, consecutive pay stubs | 6 most recent, consecutive pay stubs |\\n| Monthly (One Time Per Month) | 3 most recent, consecutive pay stubs | 3 most recent, consecutive pay stubs |\\n\\nIf you do not have any paystubs, you must submit a **CFWB-015 Referral to Employer for Employee Income Information Form**.\\n\\n---\\n\\n### If You Are Self-Employed\\nIf you have been self-employed for **one year or more**, you must submit a current, complete and signed income tax package (e.g., 1040, 1065, Schedule C, SE for partnership, K-1, etc.).\\n\\nIf you have been self-employed for **less than one year**, you must submit a **CFWB-031 Self-Employment Income Information Attestation Form**.\\n\\n---\\n\\n### Other Income\\nIf you receive other types of income outside or instead of employment income, you must submit your most recent check, pay stub, or current award letter that indicates the amount you receive. If your other income fluctuates, **3 months of documentation is required**.\\n\\nThis includes, but is not limited to:\\n- Income from SSI, SSD\\n- Unemployment benefits\\n- Rental income\\n- Pensions\\n- Annuities\\n- Worker’s compensation\\n- Alimony\\n- Child support"
        },
        {
          "id": "reason_for_care",
          "title": "Reason for Care",
          "type": "info",  
          "ui": { "markdown": true, "collapsible": true, "defaultCollapsed": true },
          "content": "### Reason for Care\\nThese documents confirm your reason for care. Every applicant must have a qualified reason for care; in a two-parent household, parents or caretakers can have the same or different reasons for care. Only the documents related to your stated reasons for care need to be uploaded, and documentation must be uploaded for all parent or caretakers in the household.\\n\\n---\\n\\n### Working 10+ Hours Per Week\\nYour employment or self-employment income documents will cover this reason for care. You do not need to submit additional documentation.\\n\\n---\\n\\n### Participating in an Educational or Vocational Training Program\\nYou will need to upload **ONE** of the following documents to confirm your participation in vocational school, two-year college, or four-year college.\\n\\n- CFWB-005 Vocational, Education and Training Verification Form\\n- A letter from the educational or vocational training program on their official letterhead; this letter must contain all the information required in the CFWB-005 Vocational, Education and Training Verification Form.\\n\\n---\\n\\n### Looking for Work\\nYou will need to upload **ONE** of the following documents to confirm that you are looking for work.\\n\\n- CFWB-026 Work Search Record Form\\n- Approved work search plan from the NYS Dept. of Labor\\n- Proof of receipt of unemployment insurance\\n\\n---\\n\\n### Experiencing Homelessness\\nYou will need to upload **ONE** of the following documents to confirm that you are experiencing homelessness. This includes families who may be living in shelter or sharing the housing of others due to loss of housing, economic hardship, or similar reason.\\n\\n- Shelter Residency Letter (If living in Shelter, including Humanitarian Emergency Relief Centers)\\n- CFWB-027 Housing Attestation (If living doubled-up, in a place not meant for human habitation, in a hotel/motel, or in another living situation)\\n\\n---\\n\\n### Attending Services for Domestic Violence\\nYou will need to upload a referral for services from a domestic violence service provider to confirm that you are attending services for domestic violence.\\n\\n---\\n\\n### Attending Services for Substance Abuse Treatment\\nYou will need to upload a referral for a substance abuse treatment service provider to confirm that you are attending services for substance abuse treatment."
        },
        {
          "id": "additional_details",
          "title": "Additional Details",
          "type": "info",  
          "ui": { "markdown": true, "collapsible": true, "defaultCollapsed": true },
          "content": "### Application Scope\\nThis application is used to apply **only** for **Category 2 or 3 child care assistance** (for families not in receipt of cash assistance). To apply for **Cash Assistance** or other benefits, including **Category 1 Child Care Assistance** (for families in receipt of cash assistance), you must use the **New York State Application for Certain Benefits and Services (LDSS-2921)**.\\n\\n---\\n\\n### Exempt Applicants\\nThe following applicants may be eligible for child care assistance **without regard to income** and do not need to complete this application:\\n\\n- Foster parents who need child care assistance to allow them to work and are only applying for assistance for the foster children;\\n- Families in receipt of protective or preventive services.\\n\\n---\\n\\n### Application Completion\\nAll sections of this form must be filled out to be considered complete **unless the section is identified as optional**. If you do not complete all required sections of this form, you may not be considered for Child Care Assistance.\\n\\n---\\n\\n### Rights and Responsibilities\\nYou may obtain information about your rights and responsibilities [here](https://otda.ny.gov/programs/applications/). If you do not have access to the internet, you can call the **Administration for Children’s Services at 212-835-7610** to request that physical copies of the booklets which highlight your rights and responsibilities be mailed to you, including:\\n\\n- **LDSS-4148A**: What You Should Know About Your Rights and Responsibilities\\n- **LDSS-4148B**: What You Should Know About Social Services Programs\\n- **LDSS-4148C**: What You Should Know If You Have an Emergency"
        }
      ]
    },
    {
      "id": "applicant",
      "title": "Applicant",
      "sections": [
        {
          "id": "personal_info",
          "title": "Personal Information",
          "fields": [
            {
              "id": "first_name",
              "label": "First Name",
              "type": "text",
              "required": true
            },
            {
              "id": "last_name",
              "label": "Last Name",
              "type": "text",
              "required": true
            },
            {
              "id": "mi",
              "label": "Middle Initial",
              "type": "text",
              "required": false
            },
            {
              "id": "date_of_birth",
              "label": "Date of Birth",
              "type": "date",
              "required": true
            },
            {
              "id": "sex",
              "label": "Sex",
              "type": "radio",
              "required": true,
              "ui": {
                "options": [
                  "Male",
                  "Female"
                ]
              }
            },
            {
              "id": "marital_status",
              "label": "Marital Status",
              "type": "select",
              "required": true,
              "ui": {
                "options": [
                  "Single",
                  "Married",
                  "Divorced",
                  "Widowed",
                  "Separated"
                ]
              }
            }
          ]
        },
        {
          "id": "contact_info",
          "title": "Contact Information",
          "fields": [
            {
              "id": "telephone_home",
              "label": "Home Phone",
              "type": "tel",
              "required": false,
              "constraints": {
                "pattern": "^\\\\(?[0-9]{3}\\\\)?[-. ]?[0-9]{3}[-. ]?[0-9]{4}$"
              },
              "ui": {
                "placeholder": "(123) 456-7890"
              }
            },
            {
              "id": "telephone_work",
              "label": "Work Phone",
              "type": "tel",
              "required": false,
              "constraints": {
                "pattern": "^\\\\(?[0-9]{3}\\\\)?[-. ]?[0-9]{3}[-. ]?[0-9]{4}$"
              },
              "ui": {
                "placeholder": "(123) 456-7890"
              }
            },
            {
              "id": "telephone_mobile_or_other",
              "label": "Mobile or Other Phone",
              "type": "tel",
              "required": false,
              "constraints": {
                "pattern": "^\\\\(?[0-9]{3}\\\\)?[-. ]?[0-9]{3}[-. ]?[0-9]{4}$"
              },
              "ui": {
                "placeholder": "(123) 456-7890"
              }
            },
            {
              "id": "email",
              "label": "Email",
              "type": "email",
              "required": true
            }
          ]
        },
        {
          "id": "address_info",
          "title": "Address",
          "fields": [
            {
              "id": "street",
              "label": "Street Address",
              "type": "text",
              "required": true
            },
            {
              "id": "apt",
              "label": "Apt #",
              "type": "text",
              "required": false
            },
            {
              "id": "city",
              "label": "City",
              "type": "text",
              "required": true
            },
            {
              "id": "borough",
              "label": "Borough",
              "type": "select",
              "required": true,
              "ui": {
                "options": [
                  "Bronx",
                  "Brooklyn",
                  "Manhattan",
                  "Queens",
                  "Staten Island"
                ]
              }
            },
            {
              "id": "state",
              "label": "State",
              "type": "text",
              "required": true
            },
            {
              "id": "zip_code",
              "label": "Zip Code",
              "type": "text",
              "required": true
            },
            {
              "id": "latitude",
              "label": "Latitude",
              "type": "number",
              "required": false
            },
            {
              "id": "longitude",
              "label": "Longitude",
              "type": "number",
              "required": false
            },
            {
              "id": "is_temporary_address",
              "label": "Is Temporary Address",
              "type": "radio",
              "required": true,
              "ui": {
                "options": [
                  "Yes",
                  "No"
                ]
              }
            },
            {
              "id": "currently_living_in",
              "label": "Currently Living In",
              "type": "select",
              "required": false,
              "ui": {
                "options": [
                  "Homeless Shelter",
                  "Doubled-up with another Family",
                  "Hotel/Motel",
                  "Car, Bus, Train",
                  "Park",
                  "Campsite",
                  "Other"
                ]
              }
            }
          ]
        },
        {
          "id": "demographics",
          "title": "Demographics",
          "fields": [
            {
              "id": "ethnicity",
              "label": "Ethnicity",
              "type": "select",
              "required": false,
              "ui": {
                "options": [
                  "Hispanic",
                  "Latino",
                  "No",
                  "Prefer not to answer"
                ]
              }
            },
            {
              "id": "race",
              "label": "Race",
              "type": "checkbox",
              "required": false,
              "ui": {
                "options": [
                  {
                    "value": "AI",
                    "label": "American Indian or Alaska Native"
                  },
                  {
                    "value": "AS",
                    "label": "Asian"
                  },
                  {
                    "value": "BL",
                    "label": "Black or African American"
                  },
                  {
                    "value": "HP",
                    "label": "Native Hawaiian or Pacific Islander"
                  },
                  {
                    "value": "WH",
                    "label": "White"
                  }
                ]
              },
              "metadata": {
                "multiple": true
              }
            },
            {
              "id": "ssn",
              "label": "Social Security Number",
              "type": "text",
              "required": false,
              "constraints": {
                "pattern": "^\\\\d{3}-\\\\d{2}-\\\\d{4}$"
              },
              "ui": {
                "placeholder": "123-45-6789"
              }
            }
          ]
        },
        {
          "id": "language_info",
          "title": "Language Preferences",
          "fields": [
            { "id": "primary_language", "label": "Primary Language", "type": "radio", "required": true,
              "ui": {
                "options": ["English", "Spanish", "Other"]
              }
            },
            { "id": "preferred_language", "label": "Preferred Language", "type": "radio", "required": true,
              "ui": {
                "options": ["English", "Spanish", "Other"]
              }
            },
            { "id": "other_primary_language", "label": "Other Primary Language", "type": "text", "required": false,
              "requiredCondition": {
                "field": "primary_language",
                "operator": "equals",
                "value": "Other"
              }
            },
            { "id": "other_preferred_language", "label": "Other Preferred Language", "type": "text", "required": false,
              "requiredCondition": {
                "field": "preferred_language",
                "operator": "equals",
                "value": "Other"
              }
            }
          ]
        },
        {
          "id": "cash_assistance",
          "title": "Cash Assistance",
          "fields": [
            { "id": "has_cash_assistance", "label": "Do you receive Cash Assistance?", "type": "radio", "required": false,
              "ui": {
                "options": ["Yes", "No"]
              }
            },
            { "id": "ca_number", "label": "Cash Assistance Number", "type": "text", "required": false,  
              "requiredCondition": {
                "condition": {
                  "field": "has_cash_assistance",
                  "operator": "equals",
                  "value": "Yes"
                }
              }
            }
          ]
        }
      ]
    },
    {
      "id": "children_needing_care",
      "title": "Children Needing Care",
      "sections": [
        {
          "id": "child_details",
          "title": "Child Details",
          "required": true,
          "fields": [
            {
              "id": "children",
              "label": "Children Needing Care",
              "type": "group",
              "metadata": {
                "multiple": true
              },
              "fields": [
                {
                  "id": "first_name",
                  "label": "First Name",
                  "type": "text",
                  "required": true
                },
                {
                  "id": "last_name",
                  "label": "Last Name",
                  "type": "text",
                  "required": true
                },
                {
                  "id": "mi",
                  "label": "Middle Initial",
                  "type": "text",
                  "required": false
                },
                {
                  "id": "relationship_to_applicant",
                  "label": "Relationship to Applicant",
                  "type": "select",
                  "required": true,
                  "ui": {
                    "options": [
                      "Child",
                      "Grandchild",
                      "Foster Child",
                      "Other"
                    ]
                  }
                },
                {
                  "id": "date_of_birth",
                  "label": "Date of Birth",
                  "type": "date",
                  "required": true
                },
                {
                  "id": "sex",
                  "label": "Sex",
                  "type": "radio",
                  "required": true,
                  "ui": {
                    "options": [
                      "Male",
                      "Female"
                    ]
                  }
                },
                {
                  "id": "ethnicity",
                  "label": "Ethnicity",
                  "type": "select",
                  "required": false,
                  "ui": {
                    "options": [
                      "Hispanic",
                      "Latino",
                      "No",
                      "Prefer not to answer"
                    ]
                  }
                },
                {
                  "id": "race",
                  "label": "Race",
                  "type": "checkbox",
                  "required": false,
                  "ui": {
                    "options": [
                      {
                        "value": "AI",
                        "label": "American Indian or Alaska Native"
                      },
                      {
                        "value": "AS",
                        "label": "Asian"
                      },
                      {
                        "value": "BL",
                        "label": "Black or African American"
                      },
                      {
                        "value": "HP",
                        "label": "Native Hawaiian or Pacific Islander"
                      },
                      {
                        "value": "WH",
                        "label": "White"
                      }
                    ]
                  },
                  "metadata": {
                    "multiple": true
                  }
                },
                {
                  "id": "ssn",
                  "label": "Social Security Number",
                  "type": "text",
                  "required": false,
                  "constraints": {
                    "pattern": "^\\\\d{3}-\\\\d{2}-\\\\d{4}$"
                  },
                  "ui": {
                    "placeholder": "123-45-6789"
                  }
                },
                {
                  "id": "do_both_parents_reside_in_home",
                  "label": "Do both parents reside in the home?",
                  "type": "radio",
                  "required": true,
                  "ui": {
                    "options": [
                      "Yes",
                      "No"
                    ]
                  }
                },
                {
                  "id": "has_disability",
                  "label": "Does the child have a disability?",
                  "type": "radio",
                  "required": true,
                  "ui": {
                    "options": [
                      "Yes",
                      "No"
                    ]
                  }
                },
                {
                  "id": "is_immigration_status_satisfactory",
                  "label": "Is immigration status satisfactory?",
                  "type": "radio",
                  "required": true,
                  "ui": {
                    "options": [
                      "Yes",
                      "No"
                    ]
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "family_members",
      "title": "Family Members",
      "sections": [
        {
          "id": "family_member_details",
          "title": "Household Member Details",
          "description": "Include household members who do not need child care assistance (e.g., spouse, partner, other children).",
          "fields": [
            {
              "id": "familymember",
              "label": "Family Members",
              "type": "group",
              "metadata": {
                "multiple": true
              },
              "fields": [
                {
                  "id": "first_name",
                  "label": "First Name",
                  "type": "text",
                  "required": true
                },
                {
                  "id": "last_name",
                  "label": "Last Name",
                  "type": "text",
                  "required": true
                },
                {
                  "id": "mi",
                  "label": "Middle Initial",
                  "type": "text",
                  "required": false
                },
                {
                  "id": "relationship_to_applicant",
                  "label": "Relationship to Applicant",
                  "type": "select",
                  "required": true,
                  "ui": {
                    "options": [
                      "Spouse",
                      "Partner",
                      "Foster Parent",
                      "Child",
                      "Other"
                    ]
                  }
                },
                {
                  "id": "date_of_birth",
                  "label": "Date of Birth",
                  "type": "date",
                  "required": true
                },
                {
                  "id": "sex",
                  "label": "Sex",
                  "type": "radio",
                  "required": true,
                  "ui": {
                    "options": [
                      "Male",
                      "Female"
                    ]
                  }
                },
                {
                  "id": "ethnicity",
                  "label": "Ethnicity",
                  "type": "select",
                  "required": false,
                  "ui": {
                    "options": [
                      "Hispanic",
                      "Latino",
                      "No",
                      "Prefer not to answer"
                    ]
                  }
                },
                {
                  "id": "race",
                  "label": "Race",
                  "type": "checkbox",
                  "required": false,
                  "ui": {
                    "options": [
                      { "value": "AI", "label": "American Indian or Alaska Native" },
                      { "value": "AS", "label": "Asian" },
                      { "value": "BL", "label": "Black or African American" },
                      { "value": "HP", "label": "Native Hawaiian or Pacific Islander" },
                      { "value": "WH", "label": "White" }
                    ]
                  },
                  "metadata": {
                    "multiple": true
                  }
                },
                {
                  "id": "ssn",
                  "label": "Social Security Number",
                  "type": "text",
                  "required": false,
                  "constraints": {
                    "pattern": "^\\\\d{3}-\\\\d{2}-\\\\d{4}$"
                  },
                  "ui": {
                    "placeholder": "123-45-6789"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "child_family_needs",
      "title": "Child / Family Needs",
      "sections": [
        {
          "id": "assistance_reason",
          "title": "Reason for Child Care Assistance",
          "description": "Select one or two reasons you are requesting Child Care Assistance.",
          "fields": [
            {
              "id": "assistance_reason",
              "label": "Reason(s) for Assistance",
              "type": "select",
              "required": true,
              "ui": {
                "options": [
                  "Employment",
                  "Looking for Work",
                  "Vocational Training/Educational Activities",
                  "Receiving Domestic Violence Services",
                  "Homelessness"
                ]
              },
              "constraints": {
                "minSelections": 1,
                "maxSelections": 2
              },
              "metadata": {
                "multiple": true
              }
            }
          ]
        },
        {
          "id": "military_status",
          "title": "Military and Parental Availability",
          "description": "Provide information about parental military status and availability for child care.",
          "fields": [
            {
              "id": "is_parent_currently_active_in_military",
              "label": "Is a Parent Currently Active Full-Time in the U.S. Military?",
              "type": "radio",
              "required": true,
              "ui": {
                "options": [
                  "Yes",
                  "No"
                ]
              }
            },
            {
              "id": "is_parent_mem_of_guard_or_mru",
              "label": "Is a Parent a Member of National Guard or Military Reserve Unit?",
              "type": "radio",
              "required": true,
              "ui": {
                "options": [
                  "Yes",
                  "No"
                ]
              }
            },
            {
              "id": "is_non_custodial_parent_available",
              "label": "Is the Non-Custodial Parent Available to Provide Care?",
              "type": "radio",
              "required": true,
              "ui": {
                "options": [
                  "Yes",
                  "No"
                ]
              }
            }
          ]
        },
        {
          "id": "duplicate_application",
          "title": "Other Applications",
          "description": "Indicate if you are also applying for or receiving child care from other agencies.",
          "fields": [
            {
              "id": "duplicate_app",
              "label": "Are You Receiving or Applying for Child Care Through Another Agency?",
              "type": "select",
              "required": false,
              "ui": {
                "options": [
                  "Not Applicable",
                  "Department of Education (DOE)",
                  "Human Resources Administration (HRA)",
                  "Department of Youth and Community Development (DYCD)",
                  "Department of Homeless Services (DHS)",
                  "Consortium for Worker Education (CWE)",
                  "Administration for Children's Services (ACS)"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "id": "employment",
      "title": "Employment",
      "sections": [
        {
          "id": "applicant_jobs",
          "title": "Applicant Employment Information",
          "description": "Enter details for up to two jobs held by the applicant.",
          "fields": [
            {
              "id": "applicant_1st_job_start_date",
              "label": "1st Job - Start Date",
              "type": "date",
              "required": false,
              "ui": {
                "group": "1st Job" 
              }
            },
            {
              "id": "applicant_1st_job_rotating_shift",
              "label": "1st Job - Has Rotating Shift?",
              "type": "radio",
              "required": false,
              "ui": {
                "options": ["Yes", "No"],
                "group": "1st Job" 
              }
            },
            {
              "id": "applicant_1st_job_requires_overtime",
              "label": "1st Job - Requires Overtime?",
              "type": "radio",
              "required": false,
              "ui": {
                "options": ["Yes", "No"],
                "group": "1st Job" 
              }
            },
            {
              "id": "applicant_1st_job_employer_name",
              "label": "1st Job - Employer Name",
              "type": "text",
              "required": false,
              "ui": {
                "group": "1st Job" 
              }
            },
            {
              "id": "applicant_1st_job_employer_phone",
              "label": "1st Job - Employer Phone",
              "type": "tel",
              "required": false,
              "ui": {
                "group": "1st Job"                
              }
            },
            {
              "id": "applicant_1st_job_employer_street",
              "label": "1st Job - Employer Street Address",
              "type": "text",
              "required": false,
              "ui": {
                "group": "1st Job" 
              }
            },
            {
              "id": "applicant_1st_job_employer_city",
              "label": "1st Job - Employer City",
              "type": "text",
              "required": false,
              "ui": {
                "group": "1st Job" 
              }
            },
            {
              "id": "applicant_1st_job_employer_state",
              "label": "1st Job - Employer State",
              "type": "text",
              "required": false,
              "ui": {
                "group": "1st Job" 
              }
            },
            {
              "id": "applicant_1st_job_employer_zipcode",
              "label": "1st Job - Employer ZIP Code",
              "type": "text",
              "required": false,
              "ui": {
                "group": "1st Job" 
              }
            },
            {
              "id": "applicant_2nd_job_start_date",
              "label": "2nd Job - Start Date",
              "type": "date",
              "required": false,
              "ui": {
                "group": "2nd Job" 
              }
            },
            {
              "id": "applicant_2nd_job_rotating_shift",
              "label": "2nd Job - Has Rotating Shift?",
              "type": "radio",
              "required": false,
              "ui": {
                "options": ["Yes", "No"],
                "group": "2nd Job"
              }
            },
            {
              "id": "applicant_2nd_job_requires_overtime",
              "label": "2nd Job - Requires Overtime?",
              "type": "radio",
              "required": false,
              "ui": {
                "options": ["Yes", "No"],
                "group": "2nd Job"
              }
            },
            {
              "id": "applicant_2nd_job_employer_name",
              "label": "2nd Job - Employer Name",
              "type": "text",
              "required": false,
              "ui": {
                "group": "2nd Job" 
              }
            },
            {
              "id": "applicant_2nd_job_employer_phone",
              "label": "2nd Job - Employer Phone",
              "type": "tel",
              "required": false,
              "ui": {
                "group": "2nd Job" 
              }
            },
            {
              "id": "applicant_2nd_job_employer_street",
              "label": "2nd Job - Employer Street Address",
              "type": "text",
              "required": false,
              "ui": {
                "group": "2nd Job" 
              }
            },
            {
              "id": "applicant_2nd_job_employer_city",
              "label": "2nd Job - Employer City",
              "type": "text",
              "required": false,
              "ui": {
                "group": "2nd Job" 
              }
            },
            {
              "id": "applicant_2nd_job_employer_state",
              "label": "2nd Job - Employer State",
              "type": "text",
              "required": false,
              "ui": {
                "group": "2nd Job" 
              }
            },
            {
              "id": "applicant_2nd_job_employer_zipcode",
              "label": "2nd Job - Employer ZIP Code",
              "type": "text",
              "required": false,
              "ui": {
                "group": "2nd Job" 
              }
            }
          ]
        },
        {
          "id": "second_parent_jobs",
          "title": "Second Parent Employment Information",
          "description": "Enter details for up to two jobs held by the second parent (if applicable).",
          "fields": [
            {
              "id": "second_parent_1st_job_start_date",
              "label": "1st Job - Start Date",
              "type": "date",
              "required": false
            },
            {
              "id": "second_parent_1st_job_rotating_shift",
              "label": "1st Job - Has Rotating Shift?",
              "type": "radio",
              "required": false,
              "ui": {
                "options": [
                  "Yes",
                  "No"
                ]
              }
            },
            {
              "id": "second_parent_1st_job_requires_overtime",
              "label": "1st Job - Requires Overtime?",
              "type": "radio",
              "required": false,
              "ui": {
                "options": [
                  "Yes",
                  "No"
                ]
              }
            },
            {
              "id": "second_parent_1st_job_employer_name",
              "label": "1st Job - Employer Name",
              "type": "text",
              "required": false
            },
            {
              "id": "second_parent_1st_job_employer_phone",
              "label": "1st Job - Employer Phone",
              "type": "tel",
              "required": false
            },
            {
              "id": "second_parent_1st_job_employer_street",
              "label": "1st Job - Employer Street Address",
              "type": "text",
              "required": false
            },
            {
              "id": "second_parent_1st_job_employer_city",
              "label": "1st Job - Employer City",
              "type": "text",
              "required": false
            },
            {
              "id": "second_parent_1st_job_employer_state",
              "label": "1st Job - Employer State",
              "type": "text",
              "required": false
            },
            {
              "id": "second_parent_1st_job_employer_zipcode",
              "label": "1st Job - Employer ZIP Code",
              "type": "text",
              "required": false
            },
            {
              "id": "second_parent_2nd_job_start_date",
              "label": "2nd Job - Start Date",
              "type": "date",
              "required": false
            },
            {
              "id": "second_parent_2nd_job_rotating_shift",
              "label": "2nd Job - Has Rotating Shift?",
              "type": "radio",
              "required": false,
              "ui": {
                "options": [
                  "Yes",
                  "No"
                ]
              }
            },
            {
              "id": "second_parent_2nd_job_requires_overtime",
              "label": "2nd Job - Requires Overtime?",
              "type": "radio",
              "required": false,
              "ui": {
                "options": [
                  "Yes",
                  "No"
                ]
              }
            },
            {
              "id": "second_parent_2nd_job_employer_name",
              "label": "2nd Job - Employer Name",
              "type": "text",
              "required": false
            },
            {
              "id": "second_parent_2nd_job_employer_phone",
              "label": "2nd Job - Employer Phone",
              "type": "tel",
              "required": false
            },
            {
              "id": "second_parent_2nd_job_employer_street",
              "label": "2nd Job - Employer Street Address",
              "type": "text",
              "required": false
            },
            {
              "id": "second_parent_2nd_job_employer_city",
              "label": "2nd Job - Employer City",
              "type": "text",
              "required": false
            },
            {
              "id": "second_parent_2nd_job_employer_state",
              "label": "2nd Job - Employer State",
              "type": "text",
              "required": false
            },
            {
              "id": "second_parent_2nd_job_employer_zipcode",
              "label": "2nd Job - Employer ZIP Code",
              "type": "text",
              "required": false
            }
          ]
        }
      ]
    },
    {
      "id": "schedule",
      "title": "Work/Activity/Travel Time Schedule",
      "sections": [
        {
          "id": "first_parent_activity_schedule",
          "title": "First Parent Activity Schedule",
          "description": "Enter the start and end times for each day of the week for the first parent's activities.",
          "ui": {
            "layout": "table",
            "columns": ["Start Time", "End Time"],
            "rowCopy": {
              "enableUserPickSource": true,
              "rowIdentifier": "ui.rowGroup",
              "fieldsToCopy": [1, 2],
              "targetRowValues": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "copyControlLabel": "Apply selected schedule to other weekdays",
              "sourceOptions": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            }
          },
          "fields": [
            { "id": "fp_monday_from", "label": "Monday From", "type": "time",
              "ui": {
              "rowGroup": "Monday",
              "column": 1
            }},
            { "id": "fp_monday_to", "label": "Monday To", "type": "time",
              "ui": {
              "rowGroup": "Monday",
              "column": 2
            }},
            { "id": "fp_tuesday_from", "label": "Tuesday From", "type": "time",
              "ui": {
              "rowGroup": "Tuesday",
              "column": 1
            }},
            { "id": "fp_tuesday_to", "label": "Tuesday To", "type": "time",
              "ui": {
              "rowGroup": "Tuesday",
              "column": 2
            }},
            { "id": "fp_wednesday_from", "label": "Wednesday From", "type": "time",
              "ui": {
              "rowGroup": "Wednesday",
              "column": 1
            }},
            { "id": "fp_wednesday_to", "label": "Wednesday To", "type": "time",
              "ui": {
              "rowGroup": "Wednesday",
              "column": 2
            }},
            { "id": "fp_thursday_from", "label": "Thursday From", "type": "time",
              "ui": {
              "rowGroup": "Thursday",
              "column": 1
            }},
            { "id": "fp_thursday_to", "label": "Thursday To", "type": "time",
              "ui": {
              "rowGroup": "Thursday",
              "column": 2
            }},
            { "id": "fp_friday_from", "label": "Friday From", "type": "time",
              "ui": {
              "rowGroup": "Friday",
              "column": 1
            }},
            { "id": "fp_friday_to", "label": "Friday To", "type": "time",
              "ui": {
              "rowGroup": "Friday",
              "column": 2
            }},
            { "id": "fp_saturday_from", "label": "Saturday From", "type": "time",
              "ui": {
              "rowGroup": "Saturday",
              "column": 1
            }},
            { "id": "fp_saturday_to", "label": "Saturday To", "type": "time",
              "ui": {
              "rowGroup": "Saturday",
              "column": 2
            }},
            { "id": "fp_sunday_from", "label": "Sunday From", "type": "time",
              "ui": {
              "rowGroup": "Sunday",
              "column": 1
            }},
            { "id": "fp_sunday_to", "label": "Sunday To", "type": "time",
              "ui": {
              "rowGroup": "Sunday",
              "column": 2
            }}
          ]
        },
        {
          "id": "second_parent_activity_schedule",
          "title": "Second Parent Activity Schedule",
          "description": "Enter the start and end times for each day of the week for the second parent's activities.",
          "ui": {
            "layout": "table",
            "columns": ["Start Time", "End Time"],
            "rowCopy": {
              "enableUserPickSource": true,
              "rowIdentifier": "ui.rowGroup",
              "fieldsToCopy": [1, 2],
              "targetRowValues": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "copyControlLabel": "Apply selected schedule to other weekdays",
              "sourceOptions": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            }
          },
          "fields": [
            { "id": "sp_monday_from", "label": "Monday From", "type": "time",
              "ui": {
              "rowGroup": "Monday",
              "column": 1
            }},
            { "id": "sp_monday_to", "label": "Monday To", "type": "time",
              "ui": {
              "rowGroup": "Monday",
              "column": 2
            }},
            { "id": "sp_tuesday_from", "label": "Tuesday From", "type": "time",
              "ui": {
              "rowGroup": "Tuesday",
              "column": 1
            }},
            { "id": "sp_tuesday_to", "label": "Tuesday To", "type": "time",
              "ui": {
              "rowGroup": "Tuesday",
              "column": 2
            }},
            { "id": "sp_wednesday_from", "label": "Wednesday From", "type": "time",
              "ui": {
              "rowGroup": "Wednesday",
              "column": 1
            }},
            { "id": "sp_wednesday_to", "label": "Wednesday To", "type": "time",
              "ui": {
              "rowGroup": "Wednesday",
              "column": 2
            }},
            { "id": "sp_thursday_from", "label": "Thursday From", "type": "time",
              "ui": {
              "rowGroup": "Thursday",
              "column": 1
            }},
            { "id": "sp_thursday_to", "label": "Thursday To", "type": "time",
              "ui": {
              "rowGroup": "Thursday",
              "column": 2
            }},
            { "id": "sp_friday_from", "label": "Friday From", "type": "time",
              "ui": {
              "rowGroup": "Friday",
              "column": 1
            }},
            { "id": "sp_friday_to", "label": "Friday To", "type": "time",
              "ui": {
              "rowGroup": "Friday",
              "column": 2
            }},
            { "id": "sp_saturday_from", "label": "Saturday From", "type": "time",
              "ui": {
              "rowGroup": "Saturday",
              "column": 1
            }},
            { "id": "sp_saturday_to", "label": "Saturday To", "type": "time",
              "ui": {
              "rowGroup": "Saturday",
              "column": 2
            }},
            { "id": "sp_sunday_from", "label": "Sunday From", "type": "time",
              "ui": {
              "rowGroup": "Sunday",
              "column": 1
            }},
            { "id": "sp_sunday_to", "label": "Sunday To", "type": "time",
              "ui": {
              "rowGroup": "Sunday",
              "column": 2
            }}
          ]
        },
        {
          "id": "first_parent_travel_time",
          "title": "First Parent Travel Time",
          "description": "Enter the travel times and method of transport for the first parent.",
          "fields": [
            {
              "id": "fp_dropoff_travel_time",
              "label": "Drop-off Travel Time",
              "type": "select",
              "ui": {
                "options": [
                  "15 min",
                  "30 min",
                  "45 min",
                  "1 hour",
                  "More than 1 hour"
                ]
              }
            },
            {
              "id": "fp_dropoff_time_gt_1hr",
              "label": "Drop-off Time (if > 1 hour)",
              "type": "text",
              "requiredCondition": {
                "field": "fp_dropoff_travel_time",
                "operator": "equals",
                "value": "More than 1 hour"
              }
            },
            {
              "id": "fp_pickup_travel_time",
              "label": "Pick-up Travel Time",
              "type": "select",
              "ui": {
                "options": [
                  "15 min",
                  "30 min",
                  "45 min",
                  "1 hour",
                  "More than 1 hour"
                ]
              }
            },
            {
              "id": "fp_pickup_time_gt_1hr",
              "label": "Pick-up Time (if > 1 hour)",
              "type": "text",
              "requiredCondition": {
                "field": "fp_pickup_travel_time",
                "operator": "equals",
                "value": "More than 1 hour"
              }
            },
            {
              "id": "fp_public_transport_dropoff",
              "label": "Public Transport for Drop-off?",
              "type": "radio",
              "ui": {
                "options": [
                  "Yes",
                  "No"
                ]
              }
            },
            {
              "id": "fp_public_transport_pickup",
              "label": "Public Transport for Pick-up?",
              "type": "radio",
              "ui": {
                "options": [
                  "Yes",
                  "No"
                ]
              }
            }
          ]
        },
        {
          "id": "second_parent_travel_time",
          "title": "Second Parent Travel Time",
          "description": "Enter the travel times and method of transport for the second parent.",
          "fields": [
            {
              "id": "sp_dropoff_travel_time",
              "label": "Drop-off Travel Time",
              "type": "select",
              "ui": {
                "options": [
                  "15 min",
                  "30 min",
                  "45 min",
                  "1 hour",
                  "More than 1 hour"
                ]
              }
            },
            {
              "id": "sp_pickup_travel_time",
              "label": "Pick-up Travel Time",
              "type": "select",
              "ui": {
                "options": [
                  "15 min",
                  "30 min",
                  "45 min",
                  "1 hour",
                  "More than 1 hour"
                ]
              }
            },
            {
              "id": "sp_dropoff_time_gt_1hr",
              "label": "Drop-off Time (if > 1 hour)",
              "type": "text",
              "requiredCondition": {
                "field": "sp_dropoff_travel_time",
                "operator": "equals",
                "value": "More than 1 hour"
              }
            },
            {
              "id": "sp_pickup_time_gt_1hr",
              "label": "Pick-up Time (if > 1 hour)",
              "type": "text",
              "requiredCondition": {
                "field": "sp_pickup_travel_time",
                "operator": "equals",
                "value": "More than 1 hour"
              }
            },
            {
              "id": "sp_public_transport_dropoff",
              "label": "Public Transport for Drop-off?",
              "type": "radio",
              "ui": {
                "options": [
                  "Yes",
                  "No"
                ]
              }
            },
            {
              "id": "sp_public_transport_pickup",
              "label": "Public Transport for Pick-up?",
              "type": "radio",
              "ui": {
                "options": [
                  "Yes",
                  "No"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "id": "income",
      "title": "Income Information",
      "sections": [
        {
          "id": "income_sources",
          "title": "Income Sources",
          "description": "Provide details about all income sources applicable to the applicant or household.",
          "fields": [
            {
              "id": "income_sources",
              "label": "List of Income Sources",
              "type": "group",
              "metadata": {
                "multiple": true
              },
              "fields": [
                {
                  "id": "name_ref",
                  "label": "Income Source Type",
                  "type": "select",
                  "required": true,
                  "ui": {
                    "options": [
                      "ApplicantWages",
                      "SecondParentWages",
                      "SelfEmployment",
                      "ChildSupport",
                      "Alimony",
                      "Unemployment",
                      "SocialSecurity",
                      "Disability",
                      "Rental",
                      "Dividends",
                      "Retirement",
                      "CashAssistance",
                      "Other"
                    ]
                  }
                },
                {
                  "id": "other_source_text",
                  "label": "Other Source (If applicable)",
                  "type": "text",
                  "visibilityCondition": {
                    "field": "name_ref",
                    "operator": "equals",
                    "value": "Other"
                  },
                  "requiredCondition": {
                    "condition" : {
                    "field": "name_ref",
                    "operator": "equals",
                    "value": "Other"
                    }
                  }
                },
                {
                  "id": "is_source_applicable",
                  "label": "Is this Source Applicable?",
                  "type": "radio",
                  "required": true,
                  "ui": {
                    "options": [
                      "Yes",
                      "No"
                    ]
                  }
                },
                {
                  "id": "gross_amount",
                  "label": "Gross Amount ($)",
                  "type": "number",
                  "required": true
                },
                {
                  "id": "how_often",
                  "label": "Frequency of Income",
                  "type": "radio",
                  "required": true,
                  "ui": {
                    "options": [
                      "Weekly",
                      "Bi-weekly",
                      "Monthly",
                      "Other"
                    ]
                  }
                },
                {
                  "id": "recipient",
                  "label": "Recipient of Income",
                  "type": "text",
                  "required": true
                },
                {
                  "id": "monthly_amount",
                  "label": "Monthly Amount ($)",
                  "type": "number",
                  "required": true
                }
              ]
            }
          ]
        },
        {
          "id": "total_income",
          "title": "Total Household Income",
          "description": "Sum of all monthly income across sources.",
          "fields": [
            {
              "id": "total_income",
              "label": "Total Monthly Income ($)",
              "type": "number",
              "required": true
            }
          ]
        },
        {
          "id": "income_proof_section",
          "title": "Income Proof",
          "fields": [
            {
              "id": "income_proof",
              "label": "Upload Income Proof",
              "type": "file",
              "requiredCondition": {
                "condition": {
                  "field": "assistance_reason",
                  "operator": "includes",
                  "value": "Employment"
                }
              },
              "constraints": {
                "maxFileSizeMB": 5,
                "allowedTypes": [
                  "application/pdf",
                  "image/jpeg"
                ],
                "imageResolution": {
                  "minWidth": 800,
                  "minHeight": 600
                }
              },
              "metadata": {
                "proofCategory": "Income Verification",
                "examples": [
                  "Pay Stub",
                  "W-2"
                ],
                "multiple": true
              }
            }
          ]
        }
      ]
    },
    {
      "id": "provider",
      "title": "Provider",
      "sections": [
        {
          "id": "provider_choices",
          "title": "Provider Choices",
          "description": "Specify details of the provider where you intend to enroll the child(ren).",
          "fields": [
            {
              "id": "provider_choices",
              "label": "List of Providers",
              "type": "group",
              "metadata": {
                "multiple": true
              },
              "fields": [
                {
                  "id": "provider_name",
                  "label": "Provider Name",
                  "type": "text",
                  "required": true
                },
                {
                  "id": "program_number",
                  "label": "Program Number (If Applicable)",
                  "type": "text",
                  "required": false
                },
                {
                  "id": "provider_street",
                  "label": "Street Address",
                  "type": "text",
                  "required": true
                },
                {
                  "id": "provider_city",
                  "label": "City",
                  "type": "text",
                  "required": true
                },
                {
                  "id": "provider_state",
                  "label": "State",
                  "type": "text",
                  "required": true
                },
                {
                  "id": "provider_zip_code",
                  "label": "Zip Code",
                  "type": "text",
                  "required": true
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}`);
  const steps = form.steps;

  const [childrenData, setChildrenData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showChildForm, setShowChildForm] = useState(false);

  const [currentChild, setCurrentChild] = useState({});
  const [children, setChildren] = useState([]);
  const [childErrors, setChildErrors] = useState({});

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [collapsedSections, setCollapsedSections] = useState({});

  const [groupData, setGroupData] = useState({});
  const [currentGroupEntry, setCurrentGroupEntry] = useState({});
  const [editingGroupIndex, setEditingGroupIndex] = useState({});
  const [showGroupForm, setShowGroupForm] = useState({});
  const [groupErrors, setGroupErrors] = useState({});

  const [collapsedInfoSections, setCollapsedInfoSections] = useState({});
  const [collapsibleInfoSections, setCollapsibleInfoSections] = useState({});


  // ✅ Add this useEffect to auto-clear stale section errors when revisiting steps
  useEffect(() => {
    const step = steps[currentStep];

    const updatedErrors = { ...formErrors };

    // Handle state for Info Sections
    const collapsed = {};
    step.sections?.forEach((s) => {
      if (s.ui?.collapsible && s.ui?.defaultCollapsed) {
        collapsed[s.id] = true;
      }
    });
    setCollapsedInfoSections(collapsed);

    // Rest of existing logic

    step.sections.forEach(section => {
      if (section.required) {
        const hasGroupWithData = section.fields.some(f =>
          f.type === "group" &&
          Array.isArray(formData[f.id]) &&
          formData[f.id].length > 0
        );

        if (hasGroupWithData && updatedErrors[section.id]) {
          delete updatedErrors[section.id]; // ✅ Clear section-level error
        }
      }
    });

    setFormErrors(updatedErrors);
  }, [currentStep]); // 🔁 re-run when step changes


useEffect(() => {
Object.keys(groupData).forEach(fieldId => {
    const records = groupData[fieldId];
    if (records?.length > 0) {
    setFormData(prev => ({ ...prev, [fieldId]: records }));
    setFormErrors(prev => {
        const updated = { ...prev };
        // If you can infer sectionId from fieldId, use it here:
        const sectionIdMap = {
        children: "children_needing_care",
        income: "income_information",
        providers: "providers_section"
        };

        const sectionId = sectionIdMap[fieldId];

        if (sectionId) delete updated[sectionId];
        return updated;
    });
    }
});
}, [groupData]);

  const layout = JSON.parse(`{
  "stepperPosition": "right"
}`);
  const stepperPosition = layout.stepperPosition || "top"; // default to top

  const toggleSection = (sectionId) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };


  const hasErrors = (fields) =>
    fields.some(field => {
      const error = formErrors[field.id];
      const value = formData[field.id];
      const required = field.required;
      const requiredCondition = field.requiredCondition;
      const isRequired = typeof required === "boolean"
        ? required
        : requiredCondition && evaluateCondition(requiredCondition.condition, formData);

      const val = typeof value === "string" ? value.trim() : value;

      return isRequired && (!value || val === "" || error);
    });


    const handleNext = () => {
      const step = steps[currentStep];
      const result = validateStep(step, { ...formData }, children, formErrors, touched);
      setFormErrors(result.errors);
      setTouched(result.touched);
      if (!result.valid) return;

      const cleaned = cleanupHiddenFields(step, formData);
      setFormData(cleaned);
      setCurrentStep(currentStep + 1);

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "auto" });
    };





  const handleBack = () => {
    setCurrentStep(currentStep - 1);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "auto" });
  };

  const handleChange = (id, value) => {
    setFormData(prev => {
      const updated = { ...prev, [id]: value };

      // ✅ revalidate all fields that depend on this field via requiredCondition
      steps.forEach(step => {
        step.sections.forEach(section => {
          if (Array.isArray(section.fields)) {
            section.fields.forEach(f => {
              if (f.requiredCondition?.condition?.field === id) {
                validateField(f.id, updated[f.id]);
              }
            });
          }
        });
      });

      return updated;
    });

    setTouched(prev => ({ ...prev, [id]: true }));
    validateField(id, value);
  };



  const groupFieldsByGroup = (fields) => {
    const grouped = {};
    for (const field of fields) {
      const group = field.ui?.group || "default";
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(field);
    }
    return grouped;
  };

  const [visibleGroups, setVisibleGroups] = useState({});

  const toggleGroup = (groupId) => {
    setVisibleGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };


  const renderGroupedFields = (fields) => {
    const grouped = {};

    fields.forEach((field) => {
      const groupId = field.ui?.groupId || field.ui?.group || "default";
      if (!grouped[groupId]) grouped[groupId] = [];
      grouped[groupId].push(field);
    });

    return Object.entries(grouped).map(([groupKey, groupFields], idx) => {
      const first = groupFields[0];
      const groupLabel = first.ui?.groupLabel || groupKey;
      const isOptionalGroup = first.ui?.optionalGroup === true;

      return (
        <div key={`group-${groupKey}-${idx}`} className="form-group-wrapper">
          {groupKey !== "default" && (
            <div className="form-group-heading font-semibold text-lg mb-2">
              {groupLabel}
              {isOptionalGroup && (
                <span className="text-sm text-gray-500 ml-2">(Optional)</span>
              )}
            </div>
          )}
          <div className="form-subgroup-grid grid gap-4">
            {groupFields.map((field) => {
              if (field.type === "group" && field.metadata?.multiple) {
                return renderGroupField(field); // Optionally pass sectionId if needed
              }
              return renderField(field);
            })}
          </div>
        </div>
      );
    });
  };


  const renderInputField = (f, value, onChange, error) => {
    const options = f.options || f.ui?.options || [];

    return (
      <div key={f.id} className="form-group">
        <label className="form-label">
          {f.label}
          {f.required && <span className="required-asterisk"> *</span>}
        </label>

        {f.type === 'select' ? (
          <select
            value={value || ''}
            onChange={e => onChange(f.id, e.target.value)}
            className={"form-input" + (error ? " error" : "")}
          >
            <option value="">-- Select --</option>
            {options.map(opt => {
              const optionValue = typeof opt === 'string' ? opt : opt.value;
              const optionLabel = typeof opt === 'string' ? opt : opt.label;
              return (
                <option key={optionValue} value={optionValue}>
                  {optionLabel}
                </option>
              );
            })}
          </select>
        ) : f.type === 'radio' ? (
          <div className="form-radio-group">
            {options.map(opt => {
              const val = typeof opt === 'string' ? opt : opt.value;
              const label = typeof opt === 'string' ? opt : opt.label;
              return (
                <label key={val} className="inline-radio mr-4">
                  <input
                    type="radio"
                    name={f.id}
                    value={val}
                    checked={value === val}
                    onChange={e => onChange(f.id, e.target.value)}
                    className="mr-1"
                  />
                  {label}
                </label>
              );
            })}
          </div>
        ) : f.type === 'checkbox' && f.metadata?.multiple ? (
          <div className="form-checkbox-group">
            {options.map(opt => {
              const optValue = typeof opt === 'string' ? opt : opt.value;
              const optLabel = typeof opt === 'string' ? opt : opt.label;
              const isChecked = Array.isArray(value) && value.includes(optValue);

              return (
                <label key={optValue} className="inline-checkbox mr-4">
                  <input
                    type="checkbox"
                    name={f.id}
                    value={optValue}
                    checked={isChecked}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const updated = checked
                        ? [...(value || []), optValue]
                        : (value || []).filter(v => v !== optValue);
                      onChange(f.id, updated);
                    }}
                    className="mr-1"
                  />
                  {optLabel}
                </label>
              );
            })}
          </div>
        ) : f.id === "ssn" ? (
            <IMaskInput
              mask="000-00-0000"
              value={value}
              unmask={false}
              onAccept={(val) => onChange(f.id, val)}
              className={"form-input" + (error ? " error" : "")}
              placeholder={f.ui?.placeholder || "123-45-6789"}
            />
          ) : (
            <input
              type={f.type}
              value={value || ''}
              onChange={e => onChange(f.id, e.target.value)}
              placeholder={f.ui?.placeholder || ''}
              pattern={f.constraints?.pattern}
              className={"form-input" + (error ? " error" : "")}
            />
          )}

        {error && <div className="form-error-alert">{error}</div>}
      </div>
    );
  };



  const renderGroupField = (field, sectionId) => {
    const fieldId = field.id;

    const entries = groupData[fieldId] || [];
    const currentEntry = currentGroupEntry[fieldId] || {};
    const editingIndexVal = editingGroupIndex[fieldId] ?? null;
    const showForm = showGroupForm[fieldId] ?? false;
    const errors = groupErrors[fieldId] || {};

    const handleGroupChange = (index, subId, subValue) => {
      const groupValue = formData[fieldId] || [];

      const updatedGroup = [...groupValue];
      const updatedItem = { ...(updatedGroup[index] || {}) };

      updatedItem[subId] = subValue;
      updatedGroup[index] = updatedItem;

      setFormData(prev => ({
        ...prev,
        [fieldId]: updatedGroup
      }));
    };


    const handleInputChange = (fieldKey, value) => {
      setCurrentGroupEntry(prev => ({
        ...prev,
        [fieldId]: {
          ...prev[fieldId],
          [fieldKey]: Array.isArray(value) ? [...value] : value
        }
      }));
    };

    const validate = () => {
      const errs = {};
      field.fields.forEach(f => {
        if (f.required && !currentEntry[f.id]) {
          errs[f.id] = 'Required';
        }
      });
      setGroupErrors(prev => ({ ...prev, [fieldId]: errs }));
      return Object.keys(errs).length === 0;
    };

    const handleSave = () => {
      if (!validate()) return;
      const updated = [...entries];
      if (editingIndexVal !== null) {
        updated[editingIndexVal] = currentEntry;
      } else {
        updated.push(currentEntry);
      }

      // ✅ Update formData first (used by validateStep)
      setFormData(prev => {
        const newFormData = { ...prev, [fieldId]: updated };

        // ✅ Now that formData is up to date, clear error if needed
        if (updated.length > 0) {
          setFormErrors(prev => {
            const updatedErrors = { ...prev };
            delete updatedErrors[sectionId];
            return updatedErrors;
          });
        }
        return newFormData;
      });

      setGroupData(prev => ({ ...prev, [fieldId]: updated }));
      setCurrentGroupEntry(prev => ({ ...prev, [fieldId]: {} }));
      setEditingGroupIndex(prev => ({ ...prev, [fieldId]: null }));
      setShowGroupForm(prev => ({ ...prev, [fieldId]: false }));
      setGroupErrors(prev => ({ ...prev, [fieldId]: {} }));

      clearSectionErrorIfValid(sectionId, fieldId);
    };

    
    const handleEdit = (i) => {
      setCurrentGroupEntry(prev => ({ ...prev, [fieldId]: entries[i] }));
      setEditingGroupIndex(prev => ({ ...prev, [fieldId]: i }));
      setShowGroupForm(prev => ({ ...prev, [fieldId]: true }));
    };

    const handleCancel = () => {
      const entries = groupData[fieldId] || [];
      setShowGroupForm(prev => ({ ...prev, [fieldId]: false }));
      setCurrentGroupEntry(prev => ({ ...prev, [fieldId]: {} }));
      setEditingGroupIndex(prev => ({ ...prev, [fieldId]: null }));
      setGroupErrors(prev => ({ ...prev, [fieldId]: {} }));

      setFormData(prev => ({ ...prev, [fieldId]: entries }));

      // ✅ Clear section-level error if entries exist
      if (entries.length > 0) {
        setFormErrors(prev => {
          const updated = { ...prev };
          delete updated[sectionId]; // ✅ now defined
          return updated;
        });
      }
    };

    const handleDelete = (i) => {
      const updated = entries.filter((_, idx) => idx !== i);
      setGroupData(prev => ({ ...prev, [fieldId]: updated }));
      setEditingGroupIndex(prev => ({ ...prev, [fieldId]: null }));
      setShowGroupForm(prev => ({ ...prev, [fieldId]: false }));
      setCurrentGroupEntry(prev => ({ ...prev, [fieldId]: {} }));
      setFormData(prev => ({ ...prev, [fieldId]: entries }));

    };

    const clearSectionErrorIfValid = (sectionId, fieldId) => {
      if (formData[fieldId]?.length > 0) {
        setFormErrors(prev => {
          const updated = { ...prev };
          delete updated[sectionId]; // remove section-level error
          return updated;
        });
      }
    };

    return (
      <div className="group-field">
        <h4>{field.label}</h4>

        {entries.length > 0 && (
          <table className="modern-table">
            <thead>
              <tr>
                {field.fields.map(f => (
                  <th key={f.id} className="border px-4 py-2 text-left text-gray-700">
                    {f.label}
                  </th>
                ))}
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {field.fields.map(f => (
                    <td key={f.id} className="border px-4 py-2">
                      {item[f.id]}
                    </td>
                  ))}
                  <td className="border px-4 py-2 space-x-2">
                    <button className="text-blue-600 hover:underline" onClick={() => handleEdit(i)}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(i)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button onClick={() => {
          setShowGroupForm(prev => ({ ...prev, [fieldId]: true }));
          setEditingGroupIndex(prev => ({ ...prev, [fieldId]: null }));
          setCurrentGroupEntry(prev => ({ ...prev, [fieldId]: {} }));
        }}>
          Add {field.label}
        </button>

        {showForm && (
          <div className="group-entry-form">
            {field.fields.map(f =>
              renderInputField(f, currentEntry[f.id], handleInputChange, errors[f.id])
            )}

            <div className="form-actions">
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const validateField = (id, value) => {

    let error = "";

    // Search deeply inside fields and group fields
    const findField = (fields) => {
        for (const field of fields) {
        console.log("Checking field", field?.id, "with value", value);

        if (field.id === id) return field;
        if (field.type === "group" && Array.isArray(field.fields)) {
            const found = findField(field.fields);
            if (found) return found;
        }
        }
        return null;
    };

    const findFieldById = (id) => {
      for (const step of steps) {
        for (const section of step.sections) {
          if (!section.fields || !Array.isArray(section.fields)) continue;
          for (const field of section.fields) {
            if (field.id === id) return field;
            if (field.type === "group" && Array.isArray(field.fields)) {
              for (const subField of field.fields) {
                if (subField.id === id) return subField;
              }
            }
          }
        }
      }
      return null;
    };

    const field = findFieldById(id);
    if (!field) {
      console.warn("validateField: no field found for id", id);
      return;
    }

    // Fix: exit early if field not found
    if (!field) {
      console.warn("validateField: field not found for ID", id);
      return; 
    }
    const required = field.required;
    const requiredCondition = field.requiredCondition;

    const isRequired = typeof required === "boolean"
    ? required
    : requiredCondition && evaluateCondition(requiredCondition.condition || requiredCondition, formData);

    const constraints = field.constraints || {};
    const label = field.label || "";
    const type = field.type;
    const metadata = field.metadata || {};

    const val = (typeof value === "string") ? value.trim() : value;

    // Empty check
    if (isRequired && (
        val === undefined ||
        val === null ||
        (typeof val === "string" && val === "") ||
        (Array.isArray(val) && val.length === 0)
        )) {
        error = label + " is required.";
    }

    // Email format
    else if (type === "email" && typeof val === "string") {
        var emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
        if (!emailRegex.test(val)) {
        error = label + " must be a valid email address.";
        }
    }

    else if (type === "time" && typeof val === "string") {
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!timeRegex.test(val)) {
        error = label + " must be a valid time (HH:mm).";
      }
    }

    // File-specific constraints
    else if (type === "file" && val) {
      const files = metadata.multiple && Array.isArray(val) ? val : [val];

      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (!file || !file.size) continue;

        if (constraints.maxFileSizeMB && file.size > constraints.maxFileSizeMB * 1024 * 1024) {
          error = label + " file " + (file.name || "(unnamed)") + " must be smaller than " + constraints.maxFileSizeMB + " MB.";
          break;
        }

        if (constraints.allowedTypes && !constraints.allowedTypes.includes(file.type)) {
          error = `${label} file ${file.name || "(unnamed)"} must be one of: ${constraints.allowedTypes.join(", ")}`;
          break;
        }
      }
    }

    // Pattern for text
    else if (constraints.pattern && typeof val === "string" && !(new RegExp(constraints.pattern).test(val))) {
        error = label + " is invalid format.";
    }

    // String length
    else if (typeof val === "string") {
        if (constraints.minLength && val.length < constraints.minLength) {
        error = label + " must be at least " + constraints.minLength + " characters.";
        } else if (constraints.maxLength && val.length > constraints.maxLength) {
        error = label + " must be no more than " + constraints.maxLength + " characters.";
        }
    }

    else if (field.type === "checkbox" && field.metadata?.multiple) {
      const selected = formData[field.id] || [];
      if (field.required && (!Array.isArray(selected) || selected.length === 0)) {
        error = field.label + " is required.";
      }
    }

    // Selection count for multi-select
    else if (Array.isArray(val) && metadata.multiple) {
        if (constraints.minSelections && val.length < constraints.minSelections) {
        error = label + " requires at least " + constraints.minSelections + " selections.";
        } else if (constraints.maxSelections && val.length > constraints.maxSelections) {
        error = label + " allows at most " + constraints.maxSelections + " selections.";
        }
    }

    setFormErrors(function(prev) {
        var updated = {};
        for (var key in prev) {
        updated[key] = prev[key];
        }
        updated[id] = error;
        return updated;
    });
  };


  const [copySourceDayMap, setCopySourceDayMap] = useState("");

  const handleTableRowCopy = (section) => {

    const sourceDay = copySourceDayMap[section.id];
    const { rowCopy } = section.ui || {};
    if (!rowCopy || !sourceDay) return;

    const updatedFormData = { ...formData };

    const sourceFields = section.fields.filter(f =>
      f.ui?.rowGroup === sourceDay &&
      rowCopy.fieldsToCopy.includes(f.ui?.column)
    );

    const sourceValues = Object.fromEntries(
      sourceFields.map(f => [f.ui?.column, formData[f.id]])
    );

    for (const row of rowCopy.targetRowValues) {
      if (row === sourceDay) continue;

      for (const field of section.fields) {
        if (field.ui?.rowGroup === row && rowCopy.fieldsToCopy.includes(field.ui?.column)) {
          const newValue = sourceValues[field.ui?.column];
          if (newValue !== undefined) {
            updatedFormData[field.id] = newValue;
          }
        }
      }
    }

    setFormData(updatedFormData);
  };

  const renderTableLayout = (
    fields,
    formData,
    handleChange,
    formErrors,
    uiConfig = {},
    copySourceDay,
    setCopySourceDay,
    onCopySchedule,
    sectionId
  ) => {
    const groupedRows = fields.reduce((acc, field) => {
      const row = field.ui?.rowGroup || "default";
      acc[row] = acc[row] || [];
      acc[row].push(field);
      return acc;
    }, {});

    const columnHeaders = uiConfig.columns || [];

    return (
      <div className="form-table-layout">
        {/* Copy Controls (if enabled) */}
        {uiConfig.rowCopy?.enableUserPickSource && (
          <div className="copy-controls mb-4 flex items-center gap-2">
            <label className="form-label">
              Copy schedule from:
              <select
                className="form-select ml-2"
                value={copySourceDay}
                onChange={(e) => {
                  const val = e.target.value;
                  setCopySourceDayMap(prev => ({ ...prev, [sectionId]: val }));
                }}

              >
                <option value="">Select row</option>
                {uiConfig.rowCopy.sourceOptions.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="copy-button px-3 py-1 bg-blue-600 text-white rounded"
              onClick={() => onCopySchedule(sectionId)}
              disabled={!copySourceDay}
            >
              {uiConfig.rowCopy.copyControlLabel || "Copy row"}
            </button>
          </div>
        )}

        {/* Table Layout */}
        <table className="form-table w-full border-collapse">
          <thead>
            <tr>
              <th>Day</th>
              {columnHeaders.map((header, idx) => (
                <th key={`th-${idx}`}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedRows).map(([rowLabel, rowFields], rowIdx) => {
              const sortedFields = rowFields
                .slice()
                .sort((a, b) => (a.ui?.column || 0) - (b.ui?.column || 0));

              return (
                <tr key={`tr-${rowIdx}`}>
                  <td className="font-medium pr-2">{rowLabel}</td>
                  {sortedFields.map((field, colIdx) => {
                    const id = field.id;
                    const value = formData[id] || "";
                    const error = formErrors[id];
                    return (
                      <td key={`td-${rowIdx}-${colIdx}`}>
                        <input
                          type={field.type || "text"}
                          name={id}
                          placeholder={field.ui?.placeholder || ""}
                          value={value}
                          onChange={(e) => handleChange(id, e.target.value)}
                          className={"form-input" + (error ? " error" : "")}
                        />
                        {error && (
                          <div className="form-error-alert">{error}</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };


  const renderTableLayout_Old = (fields, formData, handleChange, formErrors) => {
    // Group fields by rowGroup
    const groupedRows = fields.reduce((acc, field) => {
      const row = field.ui?.rowGroup || "default";
      acc[row] = acc[row] || [];
      acc[row].push(field);
      return acc;
    }, {});

    return (
      <div className="form-table-layout">
        <table className="form-table">
          <thead>
            <tr>
              {Object.values(groupedRows)[0].map((field, colIdx) => (
                <th key={`th-${colIdx}`}>
                  {field.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.values(groupedRows).map((rowFields, rowIdx) => (
              <tr key={`tr-${rowIdx}`}>
                {rowFields.map((field, colIdx) => {
                  const id = field.id;
                  const value = formData[id] || "";
                  const error = formErrors[id];
                  return (
                    <td key={`td-${rowIdx}-${colIdx}`}>
                      <input
                        type={field.type || "text"}
                        name={id}
                        placeholder={field.ui?.placeholder || ""}
                        value={value}
                        onChange={(e) => handleChange(id, e.target.value)}
                        className={"form-input" + (error ? " error" : "")}
                      />
                      {error && <div className="form-error-alert">{error}</div>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };


  const toggleInfoSection = (sectionId) => {
    setCollapsedInfoSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const renderInfoSection = (section, isCollapsed, toggleSection) => {
    const { content, ui = {} } = section;
    const isCollapsible = ui.collapsible;

    return (
      <div className="info-section">
        <div
          className="info-section-header"
          onClick={isCollapsible ? toggleSection : undefined}
          style={{
            cursor: isCollapsible ? "pointer" : "default",
            fontWeight: "bold",
            backgroundColor: "#f0f0f0",
            padding: "0.5rem",
            borderRadius: "4px"
          }}
        >
          {section.title} {isCollapsible && (isCollapsed ? "▶" : "▼")}
        </div>

        {(!isCollapsible || !isCollapsed) && content && (
          <div
            className="info-section-content"
            style={{ marginTop: "0.5rem", paddingLeft: "1rem" }}
          >
            {ui.markdown ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              content.split("\n").map((line, idx) => <p key={idx}>{line}</p>)
            )}
          </div>
        )}
      </div>
    );
  };

  const renderField = (field) => {
    const {
      id, label, type, isRequired, ui = {}, constraints = {}, metadata = {}, visibilityCondition, requiredCondition 
    } = field;

    // ✅ Determine visibility logic
    const conditionToCheck =
      visibilityCondition ??
      (requiredCondition?.condition || requiredCondition); // Fallback if visibilityCondition is not defined

    const shouldRender = conditionToCheck
      ? evaluateCondition(conditionToCheck, formData)
      : true;

    if (!shouldRender) {
      return null; // Skip rendering
    }


    if (field.type === "group" && field.metadata?.multiple) {
      return renderGroupField(field);
    }

    const component = ui.component || "TextInput";
    const placeholder = ui.placeholder || "";
    const value = formData[id] !== undefined ? formData[id] : "";
    const error = touched[id] && formErrors[id];

    const attrs = {
      name: id,
      isRequired,
      placeholder,
      min: constraints.min,
      max: constraints.max,
      step: constraints.step,
      minLength: constraints.minLength,
      maxLength: constraints.maxLength,
      pattern: constraints.pattern,
      multiple: metadata.multiple || false,
      accept: constraints.allowedTypes ? constraints.allowedTypes.join(",") : undefined
    };

    const commonProps = {
      ...Object.fromEntries(Object.entries(attrs).filter(([_, v]) => v !== undefined)),
      className: "form-input" + (error ? " error" : ""),
      onChange: (e) => handleChange(id, e.target.files ? e.target.files[0] : e.target.value)
    };

    const errorElement = error ? <div className="form-error-alert">{error}</div> : null;

    if (type === "file") {
      return (
        <label key={id} className="form-label">
          {label}
          {(field.required === true || (field.requiredCondition && evaluateCondition(field.requiredCondition.condition, formData))) && (
            <span className="required-asterisk"> *</span>
          )}
          {metadata?.examples && (
            <div className="form-hint text-sm text-gray-500 italic mt-1">
              Examples: {metadata.examples.join(", ")}
            </div>
          )}
          <input
            type="file"
            {...commonProps}
            multiple={metadata.multiple || false}
            onChange={(e) => {
              const files = e.target.files;
              handleChange(id, metadata.multiple ? Array.from(files) : files[0]);
            }}
          />
          {errorElement}
        </label>
      );
    }

    else if (type === "radio" && (ui?.options || []).length > 0) {
      const options = ui.options;
      return (
        <div key={id} className="form-group">
          <label className="form-label">
            {label}
            {(field.required === true || (field.requiredCondition && evaluateCondition(field.requiredCondition.condition, formData))) && (
              <span className="required-asterisk"> *</span>
            )}
          </label>
          <div className="form-radio-group">
            {options.map(opt => {
              const val = typeof opt === "string" ? opt : opt.value;
              const optLabel = typeof opt === "string" ? opt : opt.label;
              return (
                <label key={val} className="inline-radio mr-4">
                  <input
                    type="radio"
                    name={id}
                    value={val}
                    checked={value === val}
                    onChange={e => handleChange(id, e.target.value)}
                    className="mr-1"
                  />
                  {optLabel}
                </label>
              );
            })}
          </div>
          {errorElement}
        </div>
      );
    }

    else if (type === "checkbox" && metadata.multiple && ui.options) {
      const selectedValues = Array.isArray(value) ? value : [];

      const handleCheckboxChange = (optValue) => {
        const newValues = selectedValues.includes(optValue)
          ? selectedValues.filter(v => v !== optValue)
          : [...selectedValues, optValue];
        handleChange(id, newValues);
      };

      return (
        <div key={id} className="form-group">
          <label className="form-label">
            {label}
            {(field.required === true || (field.requiredCondition && evaluateCondition(field.requiredCondition.condition, formData))) && (
              <span className="required-asterisk"> *</span>
            )}
          </label>
          <div className="form-checkbox-group">
            {ui.options.map(opt => {
              const optValue = typeof opt === "string" ? opt : opt.value;
              const optLabel = typeof opt === "string" ? opt : opt.label;

              return (
                <label key={optValue} className="inline-checkbox mr-4">
                  <input
                    type="checkbox"
                    name={id}
                    value={optValue}
                    checked={selectedValues.includes(optValue)}
                    onChange={() => handleCheckboxChange(optValue)}
                    className="mr-1"
                  />
                  {optLabel}
                </label>
              );
            })}
          </div>
          {error && <div className="form-error-alert">{error}</div>}
        </div>
      );
    }

    else if ((type === "select" || component === "Select") && ui.options) {
      const isMultiple = metadata.multiple === true;
      const currentValue = isMultiple
        ? Array.isArray(value) ? value : []
        : value || "";

      return (
        <label key={id} className="form-label">
          {label}
          {(field.required === true || (field.requiredCondition && evaluateCondition(field.requiredCondition.condition, formData))) && (
            <span className="required-asterisk"> *</span>
          )}
          <select
            {...commonProps}
            multiple={isMultiple}
            value={currentValue}
            onChange={(e) => {
              const selected = isMultiple
                ? Array.from(e.target.selectedOptions).map(o => o.value)
                : e.target.value;
              handleChange(id, selected);
            }}
          >
            {!isMultiple && <option value="">Select</option>}
            {ui.options.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errorElement}
        </label>
      );
    }


    else if (component === "Textarea") {
      return (
        <label key={id} className="form-label">
          {label}
          {(field.required === true || (field.requiredCondition && evaluateCondition(field.requiredCondition.condition, formData))) && (
            <span className="required-asterisk"> *</span>
          )}
          <textarea {...commonProps}></textarea>
          {errorElement}
        </label>
      );
    }

    else if (type === "time") {
      return (
        <label key={id} className="form-label">
          {label}
          {isRequired && <span className="required-asterisk"> *</span>}
          <input
              type="time"
              value={value || ""}
              onChange={(e) => handleChange(id, e.target.value)}
              className={"form-input" + (error ? " error" : "")}
              placeholder={placeholder}
          />
          
          {errorElement}
        </label>
      );
    }



    else if (type === "group" && metadata.multiple && Array.isArray(field.fields)) {
      const groupValue = formData[id] !== undefined ? formData[id] : [];
      
      const handleGroupChange = (index, subId, subValue) => {
        const updatedGroup = [...groupValue];
        updatedGroup[index] = {
          ...updatedGroup[index],
          [subId]: subValue
        };
        setFormData(prev => ({ ...prev, [id]: updatedGroup }));
      };

      const addGroupItem = () => {
        setFormData(prev => ({
          ...prev,
          [id]: [...(groupValue || []), {}]
        }));
      };

      const removeGroupItem = (index) => {
        const updatedGroup = [...groupValue];
        updatedGroup.splice(index, 1);
        setFormData(prev => ({ ...prev, [id]: updatedGroup }));
      };

      return (
        <div key={id} className="form-group-multiple">
          <label className="form-label">{label}</label>
          {groupValue.map((groupItem, idx) => (
            <div key={idx} className="form-subgroup">
              {field.fields.map(subField => {
                const subId = subField.id;
                const compositeId = id + "[" + idx + "]." + subId;
                const subValue = groupItem[subId] || "";
                const subError = formErrors[compositeId];
                const subLabel = subField.label;

                return (
                  <label key={compositeId} className="form-label">
                    {subLabel}
                    {subField.type === "select" && subField.ui?.options ? (
                      <select
                        value={subValue}
                        onChange={e => handleGroupChange(idx, subId, e.target.value)}
                        className="form-input"
                      >
                        <option value="">Select</option>
                        {subField.ui.options.map(opt => {
                          const optValue = typeof opt === "string" ? opt : opt.value;
                          const optLabel = typeof opt === "string" ? opt : opt.label;
                          return (
                            <option key={optValue} value={optValue}>
                              {optLabel}
                            </option>
                          );
                        })}

                      </select>
                    ) : subField.type === "textarea" ? (
                      <textarea
                        value={subValue}
                        onChange={e => handleGroupChange(idx, subId, e.target.value)}
                        className="form-input"
                      />
                    ) : (
                      <input
                        type={subField.type}
                        value={subValue}
                        onChange={e => handleGroupChange(idx, subId, e.target.value)}
                        className="form-input"
                      />
                    )}

                    {subError && <div className="form-error-alert">{subError}</div>}
                  </label>
                );
              })}
              <button type="button" onClick={() => removeGroupItem(idx)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addGroupItem}>Add {label}</button>
        </div>
      );
    }

    else if (
    id === "telephone_home" ||
    id === "telephone_work" ||
    id === "telephone_mobile_or_other" ||
    label.toLowerCase().includes("phone")
    ) {
        return (
          <label key={id} className="form-label">
            {label}
            {(field.required === true || (field.requiredCondition && evaluateCondition(field.requiredCondition.condition, formData))) && (
              <span className="required-asterisk"> *</span>
            )}
            <IMaskInput
              mask="(000) 000-0000"
              value={value}
              unmask={false}
              onAccept={(val) => handleChange(id, val)}
              className={"form-input" + (error ? " error" : "")}
              placeholder="(123) 456-7890"
            />
            {error && <div className="form-error-alert">{error}</div>}
          </label>
        );
    }
        
    else if (id === "ssn" || label.toLowerCase().includes("social security")) {
        return (
          <label key={id} className="form-label">
            {(field.required === true || (field.requiredCondition && evaluateCondition(field.requiredCondition.condition, formData))) && (
              <span className="required-asterisk"> *</span>
            )}
            {label}
              <IMaskInput
                mask="000-00-0000"
                value={value}
                unmask={false}
                onAccept={(val) => handleChange(id, val)}
                className={"form-input" + (error ? " error" : "")}
                placeholder="123-45-6789"
              />
            {error && <div className="form-error-alert">{error}</div>}
          </label>
        );
      }

    return (
      <label key={id} className="form-label">
        {label}
        {(field.required === true || (field.requiredCondition && evaluateCondition(field.requiredCondition.condition, formData))) && (
          <span className="required-asterisk"> *</span>
        )}
        <input type={type} value={value} {...commonProps} />
        {errorElement}
      </label>
    );
  };

  const step = steps[currentStep];

  const requiredDocs = step.sections.flatMap(section =>
    (section.fields || []).filter(f => {
      if (f.type !== "file") return false;
      const isRequired = typeof f.required === "boolean"
        ? f.required
        : f.requiredCondition && evaluateCondition(f.requiredCondition.condition || f.requiredCondition, formData);
      return isRequired;
    }).map(f => f.label)
  );

  return (
    <div className={stepperPosition === "right" ? "wizard-layout-row" : "wizard-layout-column"}>
        {stepperPosition === "right" && (
        <aside className="form-stepper-sidebar">
            <h4>Steps</h4>
            <ul className="stepper-vertical">
            {steps.map((s, i) => (
                <li
                key={s.id}
                className={i === currentStep ? "active" : ""}
                onClick={() => {
                  if (i === currentStep) return;
                  const currentStepFields = steps[currentStep].sections.flatMap(sec => sec.fields);
                  if (!hasErrors(currentStepFields)) {
                    setCurrentStep(i);
                  }
                }}
                >
                {s.title}
                </li>
            ))}
            </ul>
        </aside>
        )}

        
        <div className="form-main">
          {requiredDocs.length > 0 && (
            <aside className="required-docs">
              <h5>Required Documents</h5>
              <ul>
                {requiredDocs.map(label => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
            </aside>
          )}
    
        {stepperPosition === "top" && (
            <ul className="stepper-horizontal">
            {steps.map((s, i) => (
                <li
                key={s.id}
                className={i === currentStep ? "active" : ""}
                onClick={() => {
                  if (i === currentStep) return;
                  const currentStepFields = steps[currentStep].sections.flatMap(sec => sec.fields);
                  if (!hasErrors(currentStepFields)) {
                    setCurrentStep(i);
                  }
                }}
                >
                {s.title}
                </li>
            ))}
            </ul>
        )}

        
        <fieldset className="form-step">
          {step.sections.map(section => {
            // ✅ Info-only section
            if (section.content) {
              const isCollapsed = collapsedInfoSections[section.id] || false;
              return (
                <div key={section.id} className="form-section">
                  {renderInfoSection(section, isCollapsed, () =>
                    setCollapsedInfoSections(prev => ({
                      ...prev,
                      [section.id]: !prev[section.id]
                    }))
                  )}
                </div>
              );
            }

            // ✅ Regular input section
            return (
              <div key={section.id} className="form-section">
                <div
                  className="form-section-header"
                  onClick={() => toggleSection(section.id)}
                  style={{ cursor: "pointer", fontWeight: "bold" }}
                >
                  {section.title}
                  {section.required && <span className="required-asterisk"> *</span>}
                  {collapsedSections[section.id] ? "▶" : "▼"}
                  {hasErrors(section.fields) && (
                    <span className="form-section-alert">⚠ Input required</span>
                  )}
                  <span className="toggle-icon">
                    {collapsedSections[section.id] ? "+" : "-"}
                  </span>
                </div>

                {formErrors[section.id] && (
                  <div className="form-error-alert">{formErrors[section.id]}</div>
                )}

                {!collapsedSections[section.id] && (
                  <>
                    {section.ui?.layout === "table" ? (
                      renderTableLayout(
                        section.fields,
                        formData,
                        handleChange,
                        formErrors,
                        section.ui,
                        copySourceDayMap[section.id] || "",
                        (val) =>
                          setCopySourceDayMap((prev) => ({
                            ...prev,
                            [section.id]: val
                          })),
                        (uiConfig) => handleTableRowCopy(section, uiConfig),
                        section.id
                      )
                    ) : (
                      <div className="form-grid">
                        {renderGroupedFields(section.fields)}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </fieldset>

    
        <div className="form-navigation">
      {currentStep > 0 && <button type="button" onClick={handleBack}>Back</button>}
      {currentStep < steps.length - 1 && <button type="button" onClick={handleNext}>Next</button>}
      {currentStep === steps.length - 1 && <button type="submit">Submit</button>}
    </div>
        </div>
    </div>
  );
}
