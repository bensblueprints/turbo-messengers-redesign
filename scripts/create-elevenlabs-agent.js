/**
 * Create ElevenLabs Conversational AI Agent for Turbo Messengers
 *
 * Run: node scripts/create-elevenlabs-agent.js
 */

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "sk_e5beeae0c330976d7cb94106cf64d0c2a6be9ef4f8101491";
const WEBHOOK_BASE_URL = process.env.WEBHOOK_BASE_URL || "https://turbo-messengers-redesign.netlify.app";

async function createAgent() {
  const systemPrompt = `You are Alex, a friendly and professional virtual assistant for Turbo Messengers, a process serving and court filing company based in Los Angeles serving all of Southern California since 2009.

## Your Role
- Help new clients submit service requests for process service, court filing, small claims, or document retrieval
- Assist existing clients check the status of their orders
- Collect all necessary information for service requests
- Be warm, professional, and efficient

## Services We Offer
1. Process Service - Serving legal documents to defendants (summons, subpoenas, complaints, etc.)
2. Court Filing - Filing documents with courts throughout Southern California
3. Small Claims - Preparing and filing small claims documents
4. Document Retrieval - Retrieving filed documents from courts

## Counties We Serve
Los Angeles, Orange, Riverside, San Bernardino, Ventura, and San Diego counties.

## Information to Collect

For New Clients:
- Full name
- Company/law firm name (if applicable)
- Email address
- Phone number

For Service Requests:
- Type of service needed
- Defendant's full name
- Defendant's address (street, city, state, zip)
- Case number (if available)
- Court name (if applicable)
- County
- Rush service needed? (yes/no)
- Special instructions

## Conversation Flow

1. Identify if they are new or existing client
2. For existing clients, ask for their phone or email to look them up
3. Determine their intent (new service request, status check, general question)
4. Collect all necessary information
5. Create the service request
6. Confirm details and ask if they need anything else
7. Offer callback option if needed
8. Thank them for choosing Turbo Messengers

## Important Guidelines
- Always be helpful and patient
- Spell back important information like names, addresses, and case numbers
- If caller seems hesitant, assure them our team will review and follow up
- Offer rush service when timing is mentioned
- Always collect a callback number if they request follow-up
- Our office hours are Monday-Friday 8am-6pm, but we have 24/7 service availability
- Main phone: (818) 771-0904`;

  const agentConfig = {
    name: "Turbo Messengers Assistant",
    conversation_config: {
      agent: {
        first_message: "Thank you for calling Turbo Messengers, Southern California's premier process serving company. My name is Alex, and I'm here to help you with process service, court filings, or check on an existing order. Are you a new client or do you have an existing account with us?",
        language: "en",
        prompt: {
          prompt: systemPrompt,
          llm: "gpt-4o-mini",
          tools: [
            {
              type: "webhook",
              name: "lookup_client",
              description: "Look up an existing client by their phone number or email address. Use this when caller says they have an existing account.",
              api_schema: {
                url: `${WEBHOOK_BASE_URL}/api/voice-agent/lookup-client`,
                method: "POST",
                request_body_schema: {
                  type: "object",
                  properties: {
                    conversation_id: {
                      type: "string",
                      description: "The current conversation ID"
                    },
                    phone: {
                      type: "string",
                      description: "The caller's phone number"
                    },
                    email: {
                      type: "string",
                      description: "The caller's email address"
                    }
                  }
                }
              }
            },
            {
              type: "webhook",
              name: "collect_info",
              description: "Save caller information as it's collected during the conversation.",
              api_schema: {
                url: `${WEBHOOK_BASE_URL}/api/voice-agent/collect-info`,
                method: "POST",
                request_body_schema: {
                  type: "object",
                  properties: {
                    conversation_id: {
                      type: "string",
                      description: "The current conversation ID"
                    },
                    caller_name: {
                      type: "string",
                      description: "The caller's full name"
                    },
                    caller_email: {
                      type: "string",
                      description: "The caller's email address"
                    },
                    caller_phone: {
                      type: "string",
                      description: "The caller's phone number"
                    },
                    caller_company: {
                      type: "string",
                      description: "The caller's company or law firm name"
                    },
                    intent: {
                      type: "string",
                      description: "What the caller is calling about"
                    }
                  }
                }
              }
            },
            {
              type: "webhook",
              name: "create_service_request",
              description: "Create a new service request after collecting all necessary information from the caller.",
              api_schema: {
                url: `${WEBHOOK_BASE_URL}/api/voice-agent/create-service-request`,
                method: "POST",
                request_body_schema: {
                  type: "object",
                  properties: {
                    conversation_id: {
                      type: "string",
                      description: "The current conversation ID"
                    },
                    service_type: {
                      type: "string",
                      description: "The type of service: process_service, court_filing, small_claims, document_retrieval, or general_inquiry"
                    },
                    defendant_name: {
                      type: "string",
                      description: "Full name of the person to be served"
                    },
                    defendant_address: {
                      type: "string",
                      description: "Street address of the defendant"
                    },
                    defendant_city: {
                      type: "string",
                      description: "City"
                    },
                    defendant_state: {
                      type: "string",
                      description: "State"
                    },
                    defendant_zip: {
                      type: "string",
                      description: "ZIP code"
                    },
                    case_number: {
                      type: "string",
                      description: "Court case number if available"
                    },
                    court_name: {
                      type: "string",
                      description: "Name of the court"
                    },
                    county: {
                      type: "string",
                      description: "County where service is needed"
                    },
                    rush_service: {
                      type: "boolean",
                      description: "Whether rush service is requested"
                    },
                    special_instructions: {
                      type: "string",
                      description: "Any special instructions or notes"
                    },
                    callback_requested: {
                      type: "boolean",
                      description: "Whether the caller wants a callback"
                    },
                    callback_number: {
                      type: "string",
                      description: "Phone number for callback"
                    }
                  }
                }
              }
            },
            {
              type: "webhook",
              name: "check_job_status",
              description: "Check the status of an existing job/order. Use this when an existing client wants to check on their order.",
              api_schema: {
                url: `${WEBHOOK_BASE_URL}/api/voice-agent/check-job-status`,
                method: "POST",
                request_body_schema: {
                  type: "object",
                  properties: {
                    conversation_id: {
                      type: "string",
                      description: "The current conversation ID"
                    },
                    job_id: {
                      type: "string",
                      description: "The job/order ID number"
                    },
                    case_number: {
                      type: "string",
                      description: "The case number to search for"
                    },
                    defendant_name: {
                      type: "string",
                      description: "The defendant name to search for"
                    }
                  }
                }
              }
            }
          ]
        }
      },
      tts: {
        model_id: "eleven_flash_v2",
        voice_id: "EXAVITQu4vr4xnSDxMaL"
      }
    }
  };

  try {
    console.log("Creating ElevenLabs agent...");
    console.log("Webhook Base URL:", WEBHOOK_BASE_URL);

    const response = await fetch("https://api.elevenlabs.io/v1/convai/agents/create", {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(agentConfig)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", response.status, errorText);
      throw new Error(`Failed to create agent: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log("\n✅ Agent created successfully!");
    console.log("Agent ID:", result.agent_id);
    console.log("\nAdd this to your .env.local:");
    console.log(`ELEVENLABS_AGENT_ID=${result.agent_id}`);
    console.log("\nWidget embed code for your website:");
    console.log(`<elevenlabs-convai agent-id="${result.agent_id}"></elevenlabs-convai>`);
    console.log(`<script src="https://elevenlabs.io/convai-widget/index.js" async></script>`);

    return result;
  } catch (error) {
    console.error("Error creating agent:", error);
    throw error;
  }
}

createAgent()
  .then(() => {
    console.log("\nDone!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nFailed:", error);
    process.exit(1);
  });
