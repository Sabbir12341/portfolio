// Default portfolio content, taken from Sabbir Ahmed's CV (Nov 2026).
// Used by the public site and the admin page as a fallback when the API is
// unavailable, and by backend/scripts/sync-content.js to push the content
// to the database. Edit here, then run the sync script.
(function (root) {
    const PORTFOLIO_CONTENT = {
        hero: {
            title: 'Sabbir Ahmed',
            subtitle: 'AI Automation Engineer | n8n | Claude Code | AI Agents | API Integrations',
            tagline: 'I build and run production AI workflows for real businesses: n8n pipelines, AI agents and API integrations, built for accuracy, auditability and cost control.',
            profileImage: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22128%22 height=%22128%22%3E%3Crect fill=%223b82f6%22 width=%22128%22 height=%22128%22/%3E%3Ctext x=%2264%22 y=%2275%22 font-size=%2240%22 fill=%22white%22 text-anchor=%22middle%22 font-weight=%22bold%22%3ESA%3C/text%3E%3C/svg%3E'
        },
        about: {
            paragraph1: 'I\'m an AI Automation Engineer at Smartdata Technology Ltd in Dhaka, Bangladesh. I built the automation behind OmniPost, a multi-brand AI customer messaging platform that is live for 3 brands: n8n workflows, AI agents that classify, draft and check replies, and a TypeScript engine built with Claude Code. It is all connected to Meta, Google, Telegram and OpenRouter through APIs and webhooks.',
            paragraph2: 'I build for accuracy: an audit trail for every change, access control per client, cost tracking for every AI call, and planned-vs-actual reconciliation reports. I hold a B.Sc. in Computer Science & Engineering, and my research on human activity recognition has been accepted at IEEE COMPAS 2026.',
            paragraph3: 'Next, I want to apply these strengths to automating financial workflows such as data entry, reconciliation and reporting. I\'m based in Dhaka, open to remote work during US business hours, and I work in Bangla and English.'
        },
        skills: [
            {
                title: 'AI & Agents',
                icon: 'fa-brain',
                items: ['Claude & Claude Code', 'OpenRouter (GPT-4.1), Groq, Gemini', 'LangChain', 'AI agents & multi-agent systems', 'RAG', 'Tool calling & structured JSON output', 'Prompt design', 'AI cost tracking']
            },
            {
                title: 'Automation',
                icon: 'fa-cogs',
                items: ['n8n (advanced)', 'Webhooks & sub-workflows', 'Error workflows', 'Postgres / HTTP nodes', 'Scheduled workflows', 'Zapier']
            },
            {
                title: 'APIs & Integrations',
                icon: 'fa-link',
                items: ['REST APIs & webhooks', 'Meta Graph API', 'Google Business Profile API', 'Telegram Bot API', 'Gmail & Google services', 'Airtable', 'Pinecone']
            },
            {
                title: 'Data',
                icon: 'fa-database',
                items: ['PostgreSQL / Supabase', 'SQL & MySQL', 'Excel / CSV data processing', 'Data validation', 'Audit logging', 'Access control (RLS)']
            },
            {
                title: 'Programming & Tools',
                icon: 'fa-code',
                items: ['TypeScript & JavaScript', 'Python (scikit-learn, SHAP)', 'PHP', 'Next.js & Node.js', 'Git / GitHub', 'Postman & Vercel']
            }
        ],
        projects: [
            {
                icon: 'fa-comments',
                title: 'OmniPost: AI Customer Messaging Platform',
                description: 'Production platform live for 3 brands (built at Smartdata Technology). An end-to-end AI pipeline answers Facebook, Messenger, Instagram, LinkedIn and Google review messages in English and Bangla. It has confidence-based human approval, a second-pass fact check that caught 15 of 15 invented answers, row-level security per client, a full audit log and per-call AI cost tracking.',
                badges: ['n8n', 'TypeScript', 'Next.js', 'Supabase', 'Claude Code', 'Meta Graph API', 'OpenRouter'],
                github: '',
                demo: 'https://omnipost-user-dashboard.vercel.app',
                demoLabel: 'Live Dashboard'
            },
            {
                icon: 'fa-chart-line',
                title: 'Intelligent Stock Analysis Telegram Bot',
                description: 'Real-time AI bot that generates TradingView charts and delivers technical analysis of financial markets, using an LLM with image understanding, sub-workflows, tool calling and structured outputs.',
                badges: ['n8n', 'Telegram Bot API', 'Vision LLM', 'Tool Calling'],
                github: 'https://github.com/Sabbir12341',
                demo: ''
            },
            {
                icon: 'fa-robot',
                title: 'AI Messenger Lead Generation Agent',
                description: 'Facebook Messenger agent that qualifies leads using a Google Docs knowledge base, tool calling, memory and a structured conversation flow.',
                badges: ['n8n', 'RAG', 'AI Agent', 'Groq', 'Facebook Graph API', 'Webhooks'],
                github: 'https://github.com/Sabbir12341',
                demo: ''
            },
            {
                icon: 'fa-file-alt',
                title: 'RAG Document Q&A System',
                description: 'Document question answering with Pinecone, HuggingFace embeddings and semantic retrieval.',
                badges: ['RAG', 'Pinecone', 'HuggingFace', 'Semantic Search'],
                github: 'https://github.com/Sabbir12341',
                demo: ''
            },
            {
                icon: 'fa-newspaper',
                title: 'Multi-Agent AI Newsletter Generator',
                description: 'Multiple LLM agents research a topic with Tavily, write a full HTML newsletter and send personalized drafts via Gmail.',
                badges: ['n8n', 'Multi-Agent', 'Tavily', 'Gmail API'],
                github: 'https://github.com/Sabbir12341',
                demo: ''
            },
            {
                icon: 'fa-microscope',
                title: 'Human Activity Recognition (IEEE COMPAS 2026)',
                description: 'Research paper accepted at IEEE COMPAS 2026. Recursive feature elimination plus a precomputed Gaussian-kernel SVM reached 95.86% accuracy on smartphone sensor data, with predictions explained using SHAP.',
                badges: ['Python', 'scikit-learn', 'SVM', 'RFE', 'SHAP'],
                github: 'https://github.com/Sabbir12341',
                demo: ''
            }
        ],
        contact: {
            email: 'khandokarsabbirahmed12@gmail.com',
            linkedin: 'https://www.linkedin.com/in/sabbir-ahmed-9537231ba/',
            github: 'https://github.com/Sabbir12341'
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = PORTFOLIO_CONTENT;
    } else {
        root.PORTFOLIO_CONTENT = PORTFOLIO_CONTENT;
    }
})(typeof window !== 'undefined' ? window : globalThis);
