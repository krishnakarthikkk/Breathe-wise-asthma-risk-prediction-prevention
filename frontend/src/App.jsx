import { cloneElement, isValidElement, useEffect, useMemo, useRef, useState } from 'react'
import { Activity, ArrowRight, BarChart3, BookOpen, Check, ChevronDown, CircleHelp, Database, Download, ExternalLink, HeartPulse, Info, LayoutDashboard, Menu, ShieldCheck, Sparkles, Wind, X, Eye, EyeOff, ClipboardList, LogOut, RotateCcw, Stethoscope, Leaf, Zap, FileDown, BadgeInfo, MapPin, CalendarDays, Bell, Pill, FileText, Save, Trash2, MessageCircle, Send, Moon, Sun, Languages } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

async function createGuestApiSession() {
  const response = await fetch(`${API}/api/auth/guest`, { method: 'POST' })
  const payload = await response.json()
  if (!response.ok || !payload.token) throw new Error(payload.error || 'The demo API session could not be started.')
  return payload
}

const TE = {
  'Language': 'భాష', 'English': 'ఆంగ్లం', 'Telugu': 'తెలుగు', 'Sign in': 'సైన్ ఇన్', 'Create account': 'ఖాతా సృష్టించండి', 'Full name': 'పూర్తి పేరు', 'Email address': 'ఇమెయిల్ చిరునామా', 'Password': 'పాస్‌వర్డ్', 'Confirm password': 'పాస్‌వర్డ్ నిర్ధారించండి', 'Your name': 'మీ పేరు', 'At least 8 characters': 'కనీసం 8 అక్షరాలు', 'Enter password again': 'పాస్‌వర్డ్‌ను మళ్లీ నమోదు చేయండి', 'Welcome back': 'తిరిగి స్వాగతం', 'Create your account': 'మీ ఖాతాను సృష్టించండి', 'Sign in to this browser workspace.': 'ఈ బ్రౌజర్ వర్క్‌స్పేస్‌లో సైన్ ఇన్ చేయండి.', 'Create a local account for this browser.': 'ఈ బ్రౌజర్ కోసం స్థానిక ఖాతాను సృష్టించండి.', 'Sign in to workspace': 'వర్క్‌స్పేస్‌లోకి సైన్ ఇన్', 'Continue in guest research mode': 'అతిథి పరిశోధన మోడ్‌లో కొనసాగండి', 'Switch to light theme': 'లైట్ థీమ్‌కు మారండి', 'Switch to dark theme': 'డార్క్ థీమ్‌కు మారండి',
  'Overview': 'సారాంశం', 'Risk assessment': 'ప్రమాద అంచనా', 'What-if lab': 'ఊహాత్మక విశ్లేషణ', 'Model council': 'మోడల్ పోలిక', 'Model map': 'మోడల్ మ్యాప్', 'Peak flow diary': 'పీక్ ఫ్లో డైరీ', 'Data trust lab': 'డేటా విశ్వసనీయత', 'Air quality': 'గాలి నాణ్యత', 'Inhaler learning': 'ఇన్హేలర్ మార్గదర్శి', 'Care toolkit': 'ఆస్తమా సంరక్షణ సాధనాలు', 'My journal': 'నా డైరీ', 'Data library': 'డేటా లైబ్రరీ', 'RESEARCH WORKSPACE': 'పరిశోధన వర్క్‌స్పేస్', 'Workspace': 'వర్క్‌స్పేస్', 'API connected': 'API అనుసంధానమైంది', 'API offline': 'API అందుబాటులో లేదు', 'YOUR WORKSPACE': 'మీ వర్క్‌స్పేస్', 'EXPLAINABLE ML · ASTHMA RESEARCH': 'వివరణాత్మక ML · ఆస్తమా పరిశోధన', 'YOUR RESEARCH WORKSPACE': 'మీ పరిశోధన వర్క్‌స్పేస్', 'BROWSER-ONLY WORKSPACE': 'బ్రౌజర్‌లో మాత్రమే వర్క్‌స్పేస్', 'PRIVATE TO YOUR ACCOUNT': 'మీ ఖాతాకు మాత్రమే', 'PERSONAL ORGANIZATION TOOLS': 'వ్యక్తిగత నిర్వహణ సాధనాలు', 'DATA & RESPONSIBLE USE': 'డేటా మరియు బాధ్యతాయుత వినియోగం', 'DEVICE EDUCATION': 'పరికర వినియోగ సమాచారం', 'LOCAL ENVIRONMENT CONTEXT': 'స్థానిక పర్యావరణ సమాచారం',
  'Model overview': 'మోడల్ సారాంశం', 'Understand the signals.': 'సూచనలను అర్థం చేసుకోండి.', 'Explore the model.': 'మోడల్‌ను పరిశీలించండి.', 'Research demo only.': 'పరిశోధన ప్రదర్శన మాత్రమే.', 'About the data': 'డేటా గురించి', 'Models ready': 'మోడళ్లు సిద్ధంగా ఉన్నాయి', 'Waiting for API': 'API కోసం వేచి ఉంది', 'Run risk assessment': 'ప్రమాద అంచనాను ప్రారంభించండి', 'Asthma care toolkit': 'ఆస్తమా సంరక్షణ సాధనాలు', 'Action-plan wallet': 'చర్య ప్రణాళిక', 'Medicine reminders': 'మందుల రిమైండర్లు', 'Appointment prep': 'వైద్య సందర్శనకు సిద్ధం', 'Trigger detective': 'ట్రిగ్గర్ విశ్లేషణ', 'Generate health summary PDF': 'ఆరోగ్య సారాంశం PDF తయారు చేయండి', 'Symptom & trigger journal': 'లక్షణాలు మరియు ట్రిగ్గర్ల డైరీ', 'Air quality lookup': 'గాలి నాణ్యత వివరాలు', 'Inhaler learning center': 'ఇన్హేలర్ అభ్యాస కేంద్రం', 'Asthma guide': 'ఆస్తమా మార్గదర్శి', 'Some medical details and source material are shown in English to preserve the original clinical wording.': 'మూల వైద్య పదజాలాన్ని అలాగే ఉంచేందుకు కొన్ని వైద్య వివరాలు మరియు మూలాలు ఆంగ్లంలో చూపబడతాయి.', 'Make sense of': 'అర్థం చేసుకోండి', 'the signals.': 'సూచనలను.', 'Compare approaches': 'విధానాలను పోల్చండి', 'Private to this browser session': 'ఈ బ్రౌజర్ సెషన్‌కు మాత్రమే', 'Send message': 'సందేశం పంపండి', 'Find a clinician': 'వైద్య నిపుణుడిని కనుగొనండి', 'Appointment PDF': 'వైద్య సందర్శన PDF', 'Close': 'మూసివేయండి', 'Try asking': 'ఇలా అడగండి', 'Ask about asthma…': 'ఆస్తమా గురించి అడగండి…', 'City or postal code': 'నగరం లేదా పోస్టల్ కోడ్', 'Look up air': 'గాలి నాణ్యతను చూడండి', 'Searching…': 'వెతుకుతోంది…', 'Clinician type': 'వైద్య నిపుణుడి రకం', 'Search nearby clinician listings': 'సమీపంలోని వైద్యుల జాబితాను వెతకండి', 'Search Google Maps': 'Google Maps‌లో వెతకండి',
  'Remember my records on this browser': 'నా రికార్డులను ఈ బ్రౌజర్‌లో గుర్తుంచుకోండి', 'Stored only on this device. Avoid shared computers.': 'ఈ పరికరంలో మాత్రమే నిల్వ అవుతాయి. ఇతరులతో పంచుకునే కంప్యూటర్లలో ఉపయోగించవద్దు.', 'Saved on this browser': 'ఈ బ్రౌజర్‌లో సేవ్ అయ్యాయి', 'Session only': 'ఈ సెషన్ వరకు మాత్రమే', 'Guest session': 'అతిథి సెషన్'
}
Object.assign(TE, {
  'Your workspace': 'మీ వర్క్‌స్పేస్', 'Model overview': 'మోడల్ సారాంశం', 'Prediction': 'అంచనా', 'Risk score': 'ప్రమాద స్కోరు', 'Recent activity': 'ఇటీవలి కార్యకలాపాలు', 'Run assessment': 'అంచనా చేయండి', 'Assess risk': 'ప్రమాదాన్ని అంచనా వేయండి', 'Age': 'వయస్సు', 'Body mass index': 'శరీర ద్రవ్యరాశి సూచిక', 'Current smoker': 'ప్రస్తుతం ధూమపానం చేస్తారు', 'Family history': 'కుటుంబ చరిత్ర', 'Known allergies': 'తెలిసిన అలర్జీలు', 'Recent wheezing': 'ఇటీవలి వీజింగ్', 'Night symptoms': 'రాత్రి లక్షణాలు', 'Exercise-triggered symptoms': 'వ్యాయామంతో వచ్చే లక్షణాలు', 'Air quality exposure': 'గాలి నాణ్యత ప్రభావం', 'Respiratory infections': 'శ్వాసకోశ ఇన్ఫెక్షన్లు', 'years': 'సంవత్సరాలు', 'Run a demo prediction': 'డెమో అంచనాను ప్రారంభించండి', 'Calculate the combined demo score': 'కలిపిన డెమో స్కోరును లెక్కించండి', 'No prediction yet': 'ఇంకా అంచనా లేదు', 'Model comparison': 'మోడల్ పోలిక', 'Model metrics': 'మోడల్ కొలమానాలు', 'Synthetic dataset': 'సింథటిక్ డేటాసెట్', 'generated rows': 'సృష్టించిన వరుసలు', 'input features': 'ఇన్‌పుట్ లక్షణాలు', 'preview rows': 'ప్రివ్యూ వరుసలు', 'Get preview CSV': 'ప్రివ్యూ CSV పొందండి', 'Included with project': 'ప్రాజెక్ట్‌తో చేర్చబడింది', 'Symptom': 'లక్షణం', 'Severity': 'తీవ్రత', 'Possible trigger': 'సంభావ్య ట్రిగ్గర్', 'Night waking': 'రాత్రి మేల్కొనడం', 'Notes': 'గమనికలు', 'Save entry': 'నమోదును సేవ్ చేయండి', 'Add entry': 'నమోదు జోడించండి', 'Peak flow': 'పీక్ ఫ్లో', 'Record reading': 'రీడింగ్ నమోదు చేయండి', 'Clinician or clinic (optional)': 'వైద్యుడు లేదా క్లినిక్ (ఐచ్ఛికం)', 'Emergency contact (optional)': 'అత్యవసర సంప్రదింపు (ఐచ్ఛికం)', 'Save my plan notes': 'నా ప్రణాళిక గమనికలను సేవ్ చేయండి', 'Saved for this session': 'ఈ సెషన్‌కు సేవ్ చేయబడింది', 'Reminder label': 'రిమైండర్ పేరు', 'Time': 'సమయం', 'Add reminder': 'రిమైండర్ జోడించండి', 'No reminders added yet.': 'ఇంకా రిమైండర్లు జోడించలేదు.', 'No entries yet': 'ఇంకా నమోదులు లేవు', 'Find a clinician': 'వైద్య నిపుణుడిని కనుగొనండి', 'Appointment prep': 'వైద్య సందర్శనకు సిద్ధం', 'Trigger detective': 'ట్రిగ్గర్ విశ్లేషణ', 'No symptoms': 'లక్షణాలు లేవు', 'None noted': 'ఏదీ నమోదు చేయలేదు', 'None': 'ఏదీ లేదు', 'Mild': 'తక్కువ', 'Moderate': 'మధ్యస్థం', 'High': 'ఎక్కువ', 'Cough': 'దగ్గు', 'Wheezing': 'వీజింగ్', 'Shortness of breath': 'శ్వాస తీసుకోవడంలో ఇబ్బంది', 'Chest tightness': 'ఛాతీ బిగుతు', 'Pollen': 'పుప్పొడి', 'Dust': 'ధూళి', 'Smoke': 'పొగ', 'Cold air': 'చల్లని గాలి', 'Exercise': 'వ్యాయామం', 'Other': 'ఇతర', 'Generate health summary PDF': 'ఆరోగ్య సారాంశం PDF తయారు చేయండి', 'For severe breathing problems, contact local emergency services.': 'తీవ్రమైన శ్వాస సమస్యలైతే, స్థానిక అత్యవసర సేవలను సంప్రదించండి.',
  'PERSONAL LOG OVERVIEW': 'వ్యక్తిగత నమోదు సారాంశం', 'Symptom trend calendar': 'లక్షణాల క్యాలెండర్', 'Browse your own journal and peak-flow entries by date.': 'మీ డైరీ మరియు పీక్ ఫ్లో నమోదులను తేదీ వారీగా చూడండి.', 'Journal': 'డైరీ', 'No personal records for this date.': 'ఈ తేదీకి వ్యక్తిగత నమోదులు లేవు.', 'journal entries': 'డైరీ నమోదులు', 'readings': 'రీడింగులు', 'Symptom entry': 'లక్షణ నమోదు', 'Peak-flow reading': 'పీక్ ఫ్లో రీడింగ్', 'This calendar organizes your entries only. It does not identify causes, interpret readings, or give medical advice.': 'ఈ క్యాలెండర్ మీ నమోదులను మాత్రమే క్రమబద్ధీకరిస్తుంది. కారణాలను గుర్తించదు, రీడింగులను అర్థం చేసుకోదు, వైద్య సలహా ఇవ్వదు.', 'QUICK ACCESS': 'త్వరిత వీక్షణ', 'My asthma care card': 'నా ఆస్తమా సంరక్షణ కార్డు', 'Your notes and contact details, entered from a plan made with your clinician.': 'మీ వైద్య నిపుణుడితో రూపొందించిన ప్రణాళికలోని మీ గమనికలు మరియు సంప్రదింపు వివరాలు.', 'Clinician / clinic': 'వైద్య నిపుణుడు / క్లినిక్', 'Green zone · clinician notes': 'గ్రీన్ జోన్ · వైద్యుని గమనికలు', 'Yellow zone · clinician notes': 'యెల్లో జోన్ · వైద్యుని గమనికలు', 'Red zone · clinician notes': 'రెడ్ జోన్ · వైద్యుని గమనికలు', 'Emergency contact': 'అత్యవసర సంప్రదింపు', 'Not added': 'జోడించలేదు', 'This card displays information you entered. It does not create emergency or treatment instructions. Follow your clinician-provided plan and contact local emergency services for an emergency.': 'ఈ కార్డు మీరు నమోదు చేసిన సమాచారాన్ని చూపిస్తుంది. అత్యవసర లేదా చికిత్స సూచనలను సృష్టించదు. వైద్యుడు ఇచ్చిన ప్రణాళికను అనుసరించండి; అత్యవసర పరిస్థితిలో స్థానిక అత్యవసర సేవలను సంప్రదించండి.', 'Close card': 'కార్డును మూసివేయండి', 'Care card': 'సంరక్షణ కార్డు'
  , 'Help': 'సహాయం', 'Need help?': 'సహాయం కావాలా?', 'Ask the asthma guide': 'ఆస్తమా మార్గదర్శిని అడగండి', 'Find clinician listings': 'వైద్యుల వివరాలను వెతకండి', 'Search public listings': 'బహిరంగ జాబితాల్లో వెతకండి', 'Clinician type': 'వైద్య నిపుణుడి రకం', 'City or postal code': 'నగరం లేదా పోస్టల్ కోడ్', 'Open listings': 'జాబితాలు తెరవండి', 'Official asthma information': 'అధికారిక ఆస్తమా సమాచారం', 'Asthma attacks and urgent help': 'ఆస్తమా దాడులు మరియు అత్యవసర సహాయం', 'Asthma action plan': 'ఆస్తమా కార్యాచరణ ప్రణాళిక', 'Emergency information': 'అత్యవసర సమాచారం', 'Listings are external and are not verified or endorsed by BreatheWise. Confirm credentials and availability directly.': 'ఈ బాహ్య జాబితాలను BreatheWise ధృవీకరించదు లేదా సిఫార్సు చేయదు. అర్హతలు మరియు అందుబాటును నేరుగా నిర్ధారించండి.', 'If breathing is very difficult, seek local emergency help now. Do not wait for this website or a routine appointment.': 'శ్వాస తీసుకోవడం చాలా కష్టంగా ఉంటే, వెంటనే స్థానిక అత్యవసర సహాయం పొందండి. ఈ వెబ్‌సైట్ లేదా సాధారణ అపాయింట్‌మెంట్ కోసం వేచి ఉండకండి.', 'For general questions, use the guide or trusted sources. For personal care, contact a qualified clinician.': 'సాధారణ ప్రశ్నలకు మార్గదర్శి లేదా నమ్మకమైన మూలాలను ఉపయోగించండి. వ్యక్తిగత సంరక్షణ కోసం అర్హతగల వైద్య నిపుణుడిని సంప్రదించండి.', 'Close help': 'సహాయాన్ని మూసివేయండి'
})
Object.assign(TE, { 'Prepare clinician visit summary': 'వైద్య సందర్శన సారాంశాన్ని సిద్ధం చేయండి', 'Download a PDF of your journal, peak-flow, and care notes': 'మీ డైరీ, పీక్ ఫ్లో మరియు సంరక్షణ గమనికల PDF డౌన్‌లోడ్ చేయండి' })
Object.assign(TE, { 'Add to Google Calendar': 'Google క్యాలెండర్‌లో జోడించండి', 'Select Save in Google Calendar to confirm this daily reminder.': 'ఈ రోజువారీ రిమైండర్‌ను నిర్ధారించడానికి Google క్యాలెండర్‌లో Save ఎంచుకోండి.' })
function localizeNode(node, language) {
  if (language !== 'te') return node
  if (typeof node === 'string') {
    const trimmed = node.trim()
    const translated = TE[trimmed]
    return translated ? node.replace(trimmed, translated) : node
  }
  if (Array.isArray(node)) return node.map(child => localizeNode(child, language))
  if (!isValidElement(node)) return node
  const originalValue = node.props.value ?? (node.type === 'option' && typeof node.props.children === 'string' ? node.props.children : undefined)
  const props = { children: localizeNode(node.props.children, language) }
  for (const key of ['placeholder', 'title', 'aria-label']) if (typeof node.props[key] === 'string') props[key] = TE[node.props[key]] || node.props[key]
  if (originalValue !== undefined) props.value = originalValue
  return cloneElement(node, props)
}
function Localized({ language, children }) { return localizeNode(children, language) }
const HIGH_DEMO_SCORE_THRESHOLD = 0.65
const VERY_HIGH_DEMO_SCORE_THRESHOLD = 0.85
const initial = { age: 34, bmi: 24.8, smoking: 0, family_history: 1, allergy: 1, wheezing: 0, night_symptoms: 0, exercise_trigger: 0, air_quality: 1, respiratory_infections: 1 }
const fields = [
  ['age', 'Age', 'years', 'number'], ['bmi', 'Body mass index', 'kg/m²', 'number'],
  ['smoking', 'Current smoker', '', 'toggle'], ['family_history', 'Family history', '', 'toggle'],
  ['allergy', 'Known allergies', '', 'toggle'], ['wheezing', 'Recent wheezing', '', 'toggle'],
  ['night_symptoms', 'Night symptoms', '', 'toggle'], ['exercise_trigger', 'Exercise-triggered symptoms', '', 'toggle'],
  ['air_quality', 'Air quality exposure', '0–3 scale', 'select'],
  ['respiratory_infections', 'Respiratory infections', 'in past year · 0–5', 'number'],
]
const localDateTimeValue = () => {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

function createReportPdf(lines) {
  const wrap = (line) => {
    const safe = String(line ?? '').normalize('NFKD').replace(/[^\x20-\x7E]/g, '?')
    if (!safe) return ['']
    const output = []
    let current = ''
    safe.split(/\s+/).forEach(word => {
      if (word.length > 88) {
        if (current) output.push(current)
        current = ''
        for (let index = 0; index < word.length; index += 88) output.push(word.slice(index, index + 88))
        return
      }
      if (current && `${current} ${word}`.length > 88) { output.push(current); current = word }
      else current = current ? `${current} ${word}` : word
    })
    if (current) output.push(current)
    return output
  }
  const wrappedLines = lines.flatMap(wrap)
  const pages = []
  for (let index = 0; index < wrappedLines.length; index += 48) pages.push(wrappedLines.slice(index, index + 48))
  if (!pages.length) pages.push(['BreatheWise personal health notes'])
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Kids [${pages.map((_, index) => `${4 + index * 2} 0 R`).join(' ')}] /Count ${pages.length} >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]
  pages.forEach((page, index) => {
    const pageId = 4 + index * 2
    const commands = ['BT', '/F1 10 Tf', '50 748 Td', '14 TL', ...page.map(line => `(${line.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')}) Tj T*`), 'ET'].join('\n')
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents ${pageId + 1} 0 R >>`)
    objects.push(`<< /Length ${commands.length} >>\nstream\n${commands}\nendstream`)
  })
  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n` })
  const xrefOffset = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`
  return new Blob([pdf], { type: 'application/pdf' })
}

const ASTHMA_SOURCES = {
  actionPlan: { label: 'NHLBI: Treatment and action plan', href: 'https://www.nhlbi.nih.gov/health/asthma/treatment-action-plan' },
  manage: { label: 'NHLBI: Managing asthma', href: 'https://www.nhlbi.nih.gov/health/asthma/living-with' },
  symptoms: { label: 'NHLBI: Asthma symptoms', href: 'https://www.nhlbi.nih.gov/health/asthma/symptoms' },
  diagnosis: { label: 'NHLBI: Asthma diagnosis', href: 'https://www.nhlbi.nih.gov/health/asthma/diagnosis' },
  attacks: { label: 'NHLBI: Asthma attacks', href: 'https://www.nhlbi.nih.gov/health/asthma/attacks' },
  emergency: { label: 'CDC: Asthma emergencies', href: 'https://www.cdc.gov/asthma/emergency/index.html' },
  control: { label: 'CDC: Controlling asthma', href: 'https://www.cdc.gov/asthma/control/' },
  infection: { label: 'CDC: Respiratory infections and asthma', href: 'https://www.cdc.gov/asthma/respiratory-infections/index.html' },
}

const ASTHMA_KNOWLEDGE = [
  { match: /risk score|prediction|predict|model|percentage|probability|breathewise/, text: 'The BreatheWise risk score is generated by a synthetic research demo and is not clinically validated. It cannot estimate your personal chance of asthma or guide care. A healthcare professional evaluates symptoms and may use lung-function tests.', source: ASTHMA_SOURCES.diagnosis },
  { match: /diagnos|test for asthma|spirom|lung function/, text: 'Asthma diagnosis requires a healthcare professional. They review symptoms and medical history and may use breathing tests such as spirometry to measure airflow. Symptoms alone, a peak-flow diary, or this website cannot confirm asthma.', source: ASTHMA_SOURCES.diagnosis },
  { match: /controller|reliever|quick.?relief|rescue inhaler|preventer/, text: 'In general, some asthma medicines are used regularly for long-term control, while quick-relief medicines are used for symptoms according to an individual plan. The right medicine and schedule vary. Follow your own prescription and ask your clinician or pharmacist if you are unsure.', source: ASTHMA_SOURCES.actionPlan },
  { match: /inhaler technique|how.*use.*inhaler|use.*spacer|spacer/, text: 'Inhaler steps depend on the device. Ask a clinician or pharmacist to watch you use your specific inhaler and spacer, if prescribed, and show you the correct steps. Follow the device instructions and your asthma action plan.', source: ASTHMA_SOURCES.actionPlan },
  { match: /night|wake.*cough|worse.*morning|getting worse|worsening|more often|usual activities/, text: 'Symptoms that happen more often, wake you at night, limit usual activities, or lead you to need reliever medicine more often can be signs asthma may be worsening. Follow your action plan and contact your healthcare professional to review symptoms.', source: ASTHMA_SOURCES.symptoms },
  { match: /exercise|sport|physical activ|workout|run/, text: 'Asthma does not automatically mean avoiding exercise. Regular activity is important, but symptoms during activity are worth discussing with your clinician. They can help adapt your personal plan for exercise; this chat cannot recommend pre-exercise medicine.', source: ASTHMA_SOURCES.manage },
  { match: /cold|flu|virus|infection|respiratory infection/, text: 'Respiratory viral infections, such as a cold, can trigger or worsen asthma symptoms for some people. Follow your personal asthma action plan when symptoms change, and contact a healthcare professional if you are unsure what to do.', source: ASTHMA_SOURCES.infection },
  { match: /pregnan|pregnancy/, text: 'Asthma symptoms can change during pregnancy. Contact your healthcare professional about any changes and before changing or stopping asthma medicines. This chat cannot advise on pregnancy treatment.', source: ASTHMA_SOURCES.manage },
  { match: /workplace|work asthma|job|school/, text: 'If symptoms seem connected with a workplace or school exposure, note when and where they occur and discuss the pattern with a healthcare professional. They can assess possible exposures and next steps; this chat cannot determine the cause.', source: ASTHMA_SOURCES.actionPlan },
  { match: /air quality|pollution|weather|cold air|dust|mold|mould|pet|pollen|smoke|vaping|trigger|prevent|prevention|avoid|allerg/, text: 'Triggers vary from person to person. Smoke, air pollution, allergens, dampness, cold air, or infections may affect some people. Keep notes about your own symptoms and exposures, reduce known triggers where practical, and discuss suspected links with a clinician.', source: ASTHMA_SOURCES.manage },
  { match: /peak flow|peak-flow|meter/, text: 'A peak-flow meter may be part of an asthma action plan. Ask your clinician how and when to measure and how to interpret your readings using your personal plan. The diary in this website stores readings but does not assign zones or interpret a number.', source: ASTHMA_SOURCES.manage },
  { match: /action plan|plan|what should i do/, text: 'An asthma action plan is a written plan made with a healthcare professional. It explains usual treatment, what to do when symptoms worsen, and when to seek urgent help. Use the plan made for you; I can’t create personal treatment instructions.', source: ASTHMA_SOURCES.actionPlan },
  { match: /medicine|medication|inhaler|dose|dosage|tablet|drug/, text: 'Use asthma medicines only as prescribed in your personal plan. I can’t recommend a medicine, dose, or change. Ask your clinician or pharmacist to review your treatment and demonstrate your specific inhaler technique.', source: ASTHMA_SOURCES.actionPlan },
  { match: /symptom|wheez|cough|chest tight|shortness of breath/, text: 'Common asthma symptoms include wheezing, coughing, shortness of breath, and chest tightness. They can have other causes, so a healthcare professional must evaluate them. If breathing difficulty is severe, seek emergency help now.', source: ASTHMA_SOURCES.symptoms },
  { match: /what is asthma|about asthma|explain asthma|asthma mean/, text: 'Asthma is a long-term condition affecting the airways. Symptoms can vary over time and may be triggered by different exposures or activities. A clinician can assess symptoms and help create an individual treatment and action plan.', source: ASTHMA_SOURCES.manage },
]

function answerAsthmaQuestion(question, datasetInfo) {
  const text = question.toLowerCase()
  if (/can't breathe|cannot breathe|trouble breathing|struggling to breathe|gasping|severe|blue lips|blue fingernails|turning blue|attack right now|having an attack now|can't talk|cannot talk|unable to speak|unable to walk/.test(text)) {
    return { emergency: true, text: 'If someone is having severe difficulty breathing, cannot speak or walk normally because of breathlessness, or has blue/gray lips or fingernails, seek emergency medical help now using your local emergency number. Follow their personal asthma action plan while help is being arranged. This chat cannot assess an emergency.', source: ASTHMA_SOURCES.emergency }
  }
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|what's up)[!.?,\s]*$/.test(text.trim())) {
    return { text: 'Hi! I’m here and ready to help. You can ask me an asthma question, look for a clinician, or just say hello. What would you like to do?' }
  }
  if (/\bhow are you\b|\bhow're you\b|\bhow r u\b|\bhow r you\b|\bhow you doing\b/.test(text)) {
    return { text: 'I’m doing well, thanks for asking! I’m ready to chat or help with general asthma information. How are you doing today?' }
  }
  if (/\b(who are you|what is your name|what's your name)\b/.test(text)) {
    return { text: 'I’m the BreatheWise guide, a rule-based chatbot for friendly conversation and general asthma education. I can also help you find clinician listings or prepare for an appointment.' }
  }
  if (/\bhow can i help you\b/.test(text)) {
    return { text: 'That’s kind of you! You can help by telling me what you’d like to explore. I can answer general asthma questions, help search for clinician listings, or prepare an appointment summary PDF.' }
  }
  if (/\bhow can you help( me)?\b|\bwhat can you do\b|\bwhat can i ask\b|\bwhat topics\b|^help[!.?\s]*$/.test(text.trim())) {
    return { text: 'I can chat casually, explain asthma symptoms, diagnosis, triggers, inhalers, exercise, action plans, and peak flow, answer questions about this project’s synthetic data and models, help you search clinician listings, and prepare an appointment summary PDF. I can’t diagnose, choose treatment, or verify doctors. What would you like help with?' }
  }
  if (/\b(thank you|thanks|thx)\b/.test(text)) {
    return { text: 'You’re welcome! I’m here if you have another question.' }
  }
  if (/^(bye|goodbye|see you|talk later)[!.?,\s]*$/.test(text.trim())) {
    return { text: 'Take care! You can come back any time you’d like to chat or explore asthma information.' }
  }
  if (/\b(dataset|training data|sample data|data size|rows|records|features|examples)\b|\bwhat data\b/.test(text)) {
    const rows = Number(datasetInfo?.rows) || 1200
    const featureCount = Number(datasetInfo?.features) || 10
    return { text: `BreatheWise uses ${rows.toLocaleString()} generated synthetic training examples and ${featureCount} input features: age, BMI, smoking, family history, allergies, wheezing, night symptoms, exercise triggers, air-quality exposure, and respiratory infections. Its target label is synthetic too. These are not patient records or real asthma outcomes; the data is only for demonstrating software and model behavior.` }
  }
  if (/\b(random forest|logistic regression|xgboost|model council|different models?)\b/.test(text)) {
    return { text: 'The project compares three machine-learning methods: Random Forest combines decision trees, Logistic Regression uses a linear formula, and XGBoost builds boosted trees. The combined demo score is the arithmetic mean of their three outputs when all are available. They can disagree because they learn different patterns from synthetic data. None of these percentages is a real medical risk estimate.' }
  }
  if (/find (a |me a )?(doctor|clinic|hospital|specialist)|doctor near me|nearby (doctor|clinic|hospital|pulmonologist)|book (a |an )?(doctor|appointment)|recommend (a |me a )?(doctor|specialist)|pulmonologist near|allergist near/.test(text)) {
    return { care_search: true, text: 'I can help you search public listings for a clinician. Enter a city or postal code below and choose a type of clinician to search. These external listings are not verified or endorsed by BreatheWise, and the demo score does not determine whether you need care.' }
  }
  if (/prepare.*(appointment|doctor|visit)|questions.*(doctor|clinician)|what.*ask.*(doctor|clinician)/.test(text)) {
    return { text: 'For an appointment, you could ask: What might explain my symptoms? Should I have lung-function testing? Could any medicines or inhaler technique be reviewed? Should I have a written asthma action plan? Bring your symptom notes and questions. Your clinician can tailor advice to you; this chat cannot diagnose or recommend treatment.', source: ASTHMA_SOURCES.diagnosis }
  }
  if (/\b(asthma attack|flare[- ]?up|exacerbation)\b/.test(text)) {
    return { text: 'An asthma flare or attack means symptoms are getting worse. Follow the written action plan made with your clinician. If breathing is very difficult, symptoms are rapidly worsening, or your plan says to get emergency help, contact local emergency services. This chat cannot judge how severe an episode is or give treatment instructions.', source: ASTHMA_SOURCES.attacks }
  }
  if (/\b(smok(e|ing)|secondhand smoke|tobacco|vaping)\b/.test(text)) {
    return { text: 'Smoke and other airborne irritants can worsen symptoms for some people with asthma. If smoke exposure seems connected to your symptoms, note when it happens and discuss it with a healthcare professional. They can help you consider practical steps and support options.', source: ASTHMA_SOURCES.control }
  }
  if (/\b(child|children|baby|toddler|school[- ]age)\b/.test(text) && /asthma|wheez|breath|inhaler|symptom|diagnos/.test(text)) {
    return { text: 'Asthma-like symptoms in a child should be discussed with a healthcare professional, who can assess the child’s age, symptoms, and appropriate tests. A child’s care plan and medicine instructions need to come from their clinician. Seek emergency help for severe breathing difficulty.', source: ASTHMA_SOURCES.diagnosis }
  }
  if (/\b(track|tracking|record|log|diary|journal).{0,25}(symptom|trigger|breath|asthma)|\bhow.*(track|record|log).*(symptom|asthma)\b/.test(text)) {
    return { text: 'A simple diary can record when symptoms happen, how they affect sleep or activities, possible exposures, and questions for your next appointment. Discuss patterns with a healthcare professional; a diary alone cannot identify a cause or diagnose asthma. BreatheWise includes a symptom journal and peak-flow diary.', source: ASTHMA_SOURCES.manage }
  }
  if (/\basthma\b.{0,25}\b(cure|go away|outgrow|lifelong|long[- ]term)\b|\b(cure|outgrow).{0,20}\basthma\b/.test(text)) {
    return { text: 'Asthma is a long-term condition, and symptoms can change over time. A healthcare professional can assess symptoms and help create an individual management and action plan. This chat cannot predict whether a person will outgrow asthma or recommend treatment.', source: ASTHMA_SOURCES.manage }
  }
  if (/\b(asthma|inhaler).{0,25}\b(side effects|side effect|hoarse|thrush)\b|\b(side effects|side effect)\b.{0,25}\b(asthma|inhaler|medicine)\b/.test(text)) {
    return { text: 'Asthma medicines can have side effects, and the details depend on the medicine and device. Check the patient information for your prescription and ask your doctor or pharmacist about any concern. Don’t stop or change a prescribed medicine based on this chat.', source: ASTHMA_SOURCES.actionPlan }
  }
  const matched = ASTHMA_KNOWLEDGE.find(topic => topic.match.test(text))
  return matched || { text: 'I can chat casually and share general information about asthma symptoms, diagnosis, medicines, inhaler technique, triggers, exercise, action plans, peak-flow monitoring, and this demo’s synthetic data or models. Try asking about one of these topics, or search clinician listings using the button above. For personal symptoms or treatment, contact a healthcare professional.' }
}

function AsthmaChat({ onExportSummary, datasetInfo, language, openRequest }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [careSearchOpen, setCareSearchOpen] = useState(false)
  const [careLocation, setCareLocation] = useState('')
  const [careType, setCareType] = useState('pulmonologist')
  const [messages, setMessages] = useState([{ id: 'welcome', role: 'assistant', text: 'Hi! I’m the BreatheWise guide. I can chat casually and answer general asthma education questions using trusted health resources. How can I help you today?' }])
  const bottomRef = useRef(null)
  useEffect(() => { if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [messages, open])
  useEffect(() => { if (openRequest > 0) setOpen(true) }, [openRequest])

  const sendMessage = (value = draft) => {
    const question = value.trim()
    if (!question) return
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const answer = answerAsthmaQuestion(question, datasetInfo)
    setMessages(current => [...current, { id: `${id}-q`, role: 'user', text: question }, { id: `${id}-a`, role: 'assistant', ...answer }].slice(-30))
    if (answer.care_search) setCareSearchOpen(true)
    setDraft('')
  }

  const mapsUrl = careLocation.trim()
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${careType} near ${careLocation.trim()}`)}`
    : ''
  const openAppointmentPrep = () => {
    setMessages(current => [...current, { id: `prep-${Date.now()}`, role: 'assistant', text: 'Appointment prep: bring your symptom and possible-trigger notes, peak-flow readings if you keep them, and your current clinician-provided action plan. Consider asking what evaluation is appropriate and whether your plan should be reviewed. I can also make a local PDF summary for you to review before sharing.' }].slice(-30))
    onExportSummary?.()
  }

  return <Localized language={language}><div className={`asthma-chat ${open ? 'is-open' : ''}`}>
    {open && <section className="asthma-chat-panel" aria-label="Asthma education chat">
      <header className="asthma-chat-header"><span className="asthma-chat-avatar"><Wind size={18}/></span><div><strong>Asthma guide</strong><small>Education · trusted sources</small></div><button type="button" onClick={() => setOpen(false)} aria-label="Close asthma chat"><X size={18}/></button></header>
      <div className="asthma-chat-safety"><ShieldCheck size={14}/><span>General education only. Not diagnosis or treatment advice.</span></div>
      <div className="asthma-chat-actions"><button type="button" onClick={() => setCareSearchOpen(value => !value)}><Stethoscope size={14}/> Find a clinician</button><button type="button" onClick={openAppointmentPrep}><FileText size={14}/> Appointment PDF</button></div>
      <div className="asthma-chat-messages" aria-live="polite">
        {messages.map(message => <article className={`asthma-chat-message ${message.role} ${message.emergency ? 'urgent' : ''}`} key={message.id}><p>{message.text}</p>{message.source && <a href={message.source.href} target="_blank" rel="noreferrer">{message.source.label}<ExternalLink size={11}/></a>}</article>)}
        <div ref={bottomRef}/>
      </div>
      {messages.length === 1 && <div className="asthma-chat-suggestions"><span>Try asking</span>{['What is asthma?', 'How is asthma diagnosed?', 'What are common triggers?', 'Controller vs reliever inhalers?', 'Can I exercise with asthma?', 'How do I track symptoms?', 'What should I ask my doctor?', 'What data does this demo use?'].map(prompt => <button type="button" key={prompt} onClick={() => sendMessage(prompt)}>{prompt}<ArrowRight size={12}/></button>)}</div>}
      {careSearchOpen && <div className="asthma-care-search"><div className="asthma-care-search-title"><MapPin size={15}/><strong>Search nearby clinician listings</strong></div><label>Clinician type<select value={careType} onChange={event => setCareType(event.target.value)}><option value="pulmonologist">Pulmonologist (lung specialist)</option><option value="primary care doctor">Primary-care doctor</option><option value="allergist immunologist">Allergist / immunologist</option></select></label><label>City or postal code<input value={careLocation} onChange={event => setCareLocation(event.target.value)} maxLength={100} placeholder="Enter your city or postal code"/></label><a className={!mapsUrl ? 'disabled' : ''} href={mapsUrl || undefined} target="_blank" rel="noreferrer" onClick={event => { if (!mapsUrl) event.preventDefault() }} aria-disabled={!mapsUrl}>Search Google Maps <ExternalLink size={12}/></a><small>Listings open in Google Maps. Check credentials, services, and availability directly. BreatheWise does not rank, verify, or endorse clinicians.</small></div>}
      <form className="asthma-chat-form" onSubmit={event => { event.preventDefault(); sendMessage() }}><input aria-label="Ask an asthma question" value={draft} onChange={event => setDraft(event.target.value)} placeholder="Ask about asthma…" maxLength={500}/><button type="submit" aria-label="Send message" disabled={!draft.trim()}><Send size={16}/></button></form>
      <div className="asthma-chat-foot">For severe breathing problems, contact local emergency services.</div>
    </section>}
    <button className="asthma-chat-launcher" type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-label={open ? 'Close asthma education chat' : 'Open asthma education chat'}>{open ? <X size={21}/> : <MessageCircle size={21}/>}<span>{open ? 'Close' : 'Asthma guide'}</span></button>
  </div></Localized>
}

function AuthScreen({ onSuccess }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [visible, setVisible] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const enterGuest = async () => {
    setBusy(true); setError('')
    try {
      const response = await fetch(`${API}/api/auth/guest`, { method: 'POST' })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Guest session unavailable.')
      onSuccess(payload)
    } catch (e) { setError(e.message || 'Could not reach the API.') }
    finally { setBusy(false) }
  }
  const submit = async (event) => {
    event.preventDefault(); setError('')
    if (mode === 'signup' && form.password !== form.confirm) return setError('Those passwords do not match.')
    setBusy(true)
    try {
      const response = await fetch(`${API}/api/auth/${mode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, email: form.email, password: form.password }) })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Could not complete your request.')
      onSuccess(payload)
    } catch (e) { setError(e.message || 'Could not reach the API. Start Flask and MongoDB, then try again.') }
    finally { setBusy(false) }
  }
  return <main className="auth-shell"><section className="auth-art"><div className="auth-brand"><span className="brand-mark"><Wind size={21}/></span><span>breathe<span className="brand-light">wise</span></span></div><div className="auth-message"><div className="eyebrow"><Sparkles size={14}/> EXPLAINABLE ML · ASTHMA RESEARCH</div><h1>Make sense of<br/><span>the signals.</span></h1><p>A considered workspace for exploring model behavior, understanding contributing factors, and keeping a simple symptom journal.</p><div className="auth-illustration"><div className="auth-halo"><div className="auth-icon"><Wind size={42}/></div><i/><i/><i/></div><div className="auth-note"><Sparkles size={14}/><span>Every output, explained</span></div></div></div><div className="auth-legal"><ShieldCheck size={15}/> Education and research demo only · Not medical advice</div></section><section className="auth-side"><div className="auth-form-wrap"><div className="auth-mobile-brand"><span className="brand-mark"><Wind size={19}/></span><b>breathe<span>wise</span></b></div><div className="auth-heading"><div className="eyebrow muted">YOUR RESEARCH WORKSPACE</div><h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2><p>{mode === 'login' ? 'Sign in to continue to your workspace.' : 'A few details to get your workspace ready.'}</p></div><div className="auth-tabs"><button className={mode === 'login' ? 'selected' : ''} onClick={() => { setMode('login'); setError('') }}>Sign in</button><button className={mode === 'signup' ? 'selected' : ''} onClick={() => { setMode('signup'); setError('') }}>Create account</button></div><form className="auth-form" onSubmit={submit}>{mode === 'signup' && <label>Full name<input autoComplete="name" required minLength={2} placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/></label>}<label>Email address<input type="email" autoComplete="email" required placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/></label><label>Password<div className="password-input"><input type={visible ? 'text' : 'password'} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} required minLength={8} placeholder="At least 8 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}/><button type="button" aria-label="Show password" onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={16}/> : <Eye size={16}/>}</button></div></label>{mode === 'signup' && <label>Confirm password<input type="password" autoComplete="new-password" required minLength={8} placeholder="Enter password again" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })}/></label>}{mode === 'signup' && <div className="auth-consent"><ShieldCheck size={15}/><span>Your password is stored as a secure hash. This demo does not ask for medical identity details.</span></div>}{error && <div className="auth-error"><Info size={15}/>{error}</div>}<button className="auth-submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in to workspace' : 'Create account'}{!busy && <ArrowRight size={17}/>}</button></form><p className="auth-switch">{mode === 'login' ? 'New to BreatheWise?' : 'Already have an account?'} <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}>{mode === 'login' ? 'Create an account' : 'Sign in'}</button></p><div className="auth-footer">BreatheWise research prototype <span>·</span> Non-clinical demo</div></div></section></main>
}

function BackendAccountGateLegacy({ onSuccess }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const send = async (path, body = {}) => {
    setBusy(true); setError('')
    try {
      const r = await fetch(`${API}/api/auth/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Could not connect to the service.')
      onSuccess(d)
    } catch (e) { setError(e.message || 'The Flask API is not responding.') }
    finally { setBusy(false) }
  }
  const submit = (e) => { e.preventDefault(); if (mode === 'signup' && password !== confirm) return setError('Those passwords do not match.'); send(mode === 'signup' ? 'signup' : 'login', { name, email, password }) }
  return <main className="auth-shell"><section className="auth-art"><div className="auth-brand"><span className="brand-mark"><Wind size={21}/></span><span>breathe<span className="brand-light">wise</span></span></div><div className="auth-message"><div className="eyebrow"><Sparkles size={14}/> EXPLAINABLE ML · ASTHMA RESEARCH</div><h1>Make sense of<br/><span>the signals.</span></h1><p>A considered workspace for exploring model behavior, understanding contributing factors, and keeping a simple symptom journal.</p><div className="auth-illustration"><div className="auth-halo"><div className="auth-icon"><Wind size={42}/></div><i/><i/><i/></div><div className="auth-note"><Sparkles size={14}/><span>Every output, explained</span></div></div></div><div className="auth-legal"><ShieldCheck size={15}/> Education and research demo only · Not medical advice</div></section><section className="auth-side"><div className="auth-form-wrap"><div className="auth-mobile-brand"><span className="brand-mark"><Wind size={19}/></span><b>breathe<span>wise</span></b></div><div className="auth-heading"><div className="eyebrow muted">YOUR RESEARCH WORKSPACE</div><h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2><p>{mode === 'login' ? 'Sign in to continue to your workspace.' : 'Use your name, email and a password to get started.'}</p></div><div className="auth-tabs"><button className={mode === 'login' ? 'selected' : ''} onClick={() => { setMode('login'); setError('') }}>Sign in</button><button className={mode === 'signup' ? 'selected' : ''} onClick={() => { setMode('signup'); setError('') }}>Create account</button></div><form className="auth-form" onSubmit={submit}>{mode === 'signup' && <label>Full name<input autoComplete="name" required minLength={2} value={name} onChange={e => setName(e.target.value)} placeholder="Your name"/></label>}<label>Email address<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"/></label><label>Password<input type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} required minLength={8} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters"/></label>{mode === 'signup' && <label>Confirm password<input type="password" autoComplete="new-password" required minLength={8} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Enter password again"/></label>}{mode === 'signup' && <div className="auth-consent"><ShieldCheck size={15}/><span>Passwords are hashed before storage. No medical identity details are requested.</span></div>}{error && <div className="auth-error"><Info size={15}/>{error}</div>}<button className="auth-submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in to workspace' : 'Create account'}{!busy && <ArrowRight size={17}/>}</button></form><div className="guest-divider"><span>OR</span></div><button className="guest-button" disabled={busy} onClick={() => send('guest')}>Continue in guest research mode <ArrowRight size={15}/></button><p className="guest-caption">Guest sessions are temporary. Entries and model runs are not saved to an account.</p><p className="auth-switch">{mode === 'login' ? 'New to BreatheWise?' : 'Already have an account?'} <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}>{mode === 'login' ? 'Create an account' : 'Sign in'}</button></p><div className="auth-footer">BreatheWise research prototype <span>·</span> Non-clinical demo</div></div></section></main>
}

const LOCAL_ACCOUNTS_KEY = 'breathewise_frontend_accounts_v1'

async function deriveLocalPassword(password, saltHex) {
  if (!globalThis.crypto?.subtle) throw new Error('This browser cannot create a local account. Open the site on localhost or a secure connection.')
  const salt = saltHex ? Uint8Array.from(saltHex.match(/.{1,2}/g).map(part => parseInt(part, 16))) : crypto.getRandomValues(new Uint8Array(16))
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' }, key, 256)
  const hash = Array.from(new Uint8Array(bits), byte => byte.toString(16).padStart(2, '0')).join('')
  return { salt: Array.from(salt, byte => byte.toString(16).padStart(2, '0')).join(''), hash }
}

function FrontendAccountGate({ onSuccess, theme, onToggleTheme, language, onLanguageChange }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (event) => {
    event.preventDefault(); setError('')
    const normalizedEmail = email.trim().toLowerCase()
    if (mode === 'signup' && password !== confirm) { setError('Those passwords do not match.'); return }
    setBusy(true)
    try {
      const accounts = JSON.parse(localStorage.getItem(LOCAL_ACCOUNTS_KEY) || '{}')
      if (mode === 'signup') {
        if (accounts[normalizedEmail]) throw new Error('An account for this email already exists in this browser. Sign in instead.')
        const credentials = await deriveLocalPassword(password)
        const user = { name: name.trim(), email: normalizedEmail, auth_type: 'local' }
        accounts[normalizedEmail] = { ...credentials, user }
        localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts))
        onSuccess({ token: '', user })
      } else {
        const account = accounts[normalizedEmail]
        if (!account) throw new Error('No local account found for this email. Create an account in this browser first.')
        const credentials = await deriveLocalPassword(password, account.salt)
        if (credentials.hash !== account.hash) throw new Error('Incorrect email or password for this browser account.')
        onSuccess({ token: '', user: account.user })
      }
    } catch (e) { setError(e.message || 'Could not access this browser’s local account storage.') }
    finally { setBusy(false) }
  }
  const enterGuest = () => onSuccess({ token: '', user: { name: 'Guest researcher', email: 'Temporary browser session', is_guest: true, auth_type: 'local' } })
  return <Localized language={language}><main className={`auth-shell theme-${theme}`}><section className="auth-art"><div className="auth-brand"><span className="brand-mark"><Wind size={21}/></span><span>breathe<span className="brand-light">wise</span></span></div><div className="auth-message"><div className="eyebrow"><Sparkles size={14}/> EXPLAINABLE ML · ASTHMA RESEARCH</div><h1>Make sense of<br/><span>the signals.</span></h1><p>A considered workspace for exploring model behavior, understanding contributing factors, and keeping a simple symptom journal.</p><div className="auth-illustration"><div className="auth-halo"><div className="auth-icon"><Wind size={42}/></div><i/><i/><i/></div><div className="auth-note"><Sparkles size={14}/><span>Every output, explained</span></div></div></div><div className="auth-legal"><ShieldCheck size={15}/> Education and research demo only · Not medical advice</div></section><section className="auth-side"><div className="auth-form-wrap"><div className="auth-mobile-brand"><span className="brand-mark"><Wind size={19}/></span><b>breathe<span>wise</span></b></div><div className="auth-controls"><label className="language-picker"><span><Languages size={15}/> Language / భాష</span><select aria-label="Language" value={language} onChange={event => onLanguageChange(event.target.value)}><option value="en">English</option><option value="te">తెలుగు</option></select></label><button className="auth-theme-toggle" type="button" onClick={onToggleTheme}>{theme === 'dark' ? <Sun size={15}/> : <Moon size={15}/>} Switch to {theme === 'dark' ? 'light' : 'dark'} theme</button></div><div className="auth-heading"><div className="eyebrow muted">BROWSER-ONLY WORKSPACE</div><h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2><p>{mode === 'login' ? 'Sign in to this browser workspace.' : 'Create a local account for this browser.'}</p></div><div className="auth-tabs"><button type="button" className={mode === 'login' ? 'selected' : ''} onClick={() => { setMode('login'); setError('') }}>Sign in</button><button type="button" className={mode === 'signup' ? 'selected' : ''} onClick={() => { setMode('signup'); setError('') }}>Create account</button></div><form className="auth-form" onSubmit={submit}>{mode === 'signup' && <label>Full name<input autoComplete="name" required minLength={2} value={name} onChange={e => setName(e.target.value)} placeholder="Your name"/></label>}<label>Email address<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"/></label><label>Password<input type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} required minLength={8} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters"/></label>{mode === 'signup' && <label>Confirm password<input type="password" autoComplete="new-password" required minLength={8} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Enter password again"/></label>}{mode === 'signup' && <div className="auth-consent"><ShieldCheck size={15}/><span>This browser stores your account and a password hash locally. No login request is sent to Flask or MongoDB.</span></div>}{error && <div className="auth-error"><Info size={15}/>{error}</div>}<button className="auth-submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in to workspace' : 'Create account'}{!busy && <ArrowRight size={17}/>}</button></form><div className="guest-divider"><span>OR</span></div><button className="guest-button" onClick={enterGuest}>Continue in guest research mode <ArrowRight size={15}/></button><p className="guest-caption">Local accounts are available only in this browser. Clearing browser data removes them.</p><p className="auth-switch">{mode === 'login' ? 'New to the project?' : 'Already have a local account?'} <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}>{mode === 'login' ? 'Create an account' : 'Sign in'}</button></p><div className="auth-footer">BreatheWise research prototype <span>·</span> Frontend-only sign in</div></div></section></main></Localized>
}

function AirQualityWidget({ onReportChange, language }) {
  const [city, setCity] = useState('')
  const [report, setReport] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const lookup = async (event) => {
    event.preventDefault()
    const query = city.trim()
    if (!query) return
    setBusy(true); setError(''); setReport(null); onReportChange?.(null)
    try {
      const geocodeResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`)
      if (!geocodeResponse.ok) throw new Error('Location search is unavailable right now.')
      const geocode = await geocodeResponse.json()
      const place = geocode.results?.[0]
      if (!place) throw new Error('No matching city found. Try adding the state or country.')
      const params = new URLSearchParams({ latitude: place.latitude, longitude: place.longitude, current: 'us_aqi,pm2_5,pm10', timezone: 'auto' })
      const airResponse = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params}`)
      if (!airResponse.ok) throw new Error('Air-quality data is unavailable for this location right now.')
      const payload = await airResponse.json()
      if (!payload.current) throw new Error('No current air-quality estimate was returned for this location.')
      const nextReport = { place, current: payload.current, units: payload.current_units || {} }
      setReport(nextReport)
      onReportChange?.({ location: [place.name, place.admin1, place.country].filter(Boolean).join(', '), us_aqi: payload.current.us_aqi ?? null, pm2_5: payload.current.pm2_5 ?? null, pm10: payload.current.pm10 ?? null, report_time: payload.current.time || new Date().toISOString() })
    } catch (e) { setError(e.message || 'Could not load air-quality context. Check your internet connection and try again.') }
    finally { setBusy(false) }
  }
  const aqi = report?.current?.us_aqi
  const band = aqi == null ? null : aqi <= 50 ? ['Good', 'good'] : aqi <= 100 ? ['Moderate', 'moderate'] : aqi <= 150 ? ['Unhealthy for sensitive groups', 'unhealthy'] : aqi <= 200 ? ['Unhealthy', 'unhealthy'] : aqi <= 300 ? ['Very unhealthy', 'hazardous'] : ['Hazardous', 'hazardous']
  return <Localized language={language}><section className="panel air-quality-panel" id="air-quality">
    <div className="air-quality-heading"><div className="air-title"><span className="air-icon"><Wind size={19}/></span><div><div className="eyebrow muted">LOCAL ENVIRONMENT CONTEXT</div><h2>Air quality lookup</h2><p>Search a city for an estimated AQI and particulate levels.</p></div></div><span className="air-tag">No auto-location</span></div>
    <form className="air-search" onSubmit={lookup}><label htmlFor="air-city">City or postal code</label><div><input id="air-city" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g., Kolkata" maxLength={100}/><button disabled={busy || !city.trim()}>{busy ? <><span className="spinner air-spinner"/> Searching…</> : <><Activity size={15}/> Look up air</>}</button></div></form>
    {error && <div className="air-error"><Info size={14}/>{error}</div>}
    {report && <div className="air-result"><div className="air-location"><span className="air-location-icon"><MapPin size={15}/></span><strong>{report.place.name}{report.place.admin1 ? `, ${report.place.admin1}` : ''}{report.place.country ? `, ${report.place.country}` : ''}</strong><small>{report.current.time ? `Updated ${new Date(report.current.time).toLocaleString()}` : 'Current model estimate'}</small></div><div className="air-stats"><div className={`air-aqi ${band?.[1]}`}><small>US AQI</small><strong>{aqi ?? '—'}</strong><span>{band?.[0] || 'Unavailable'}</span></div><div><small>PM2.5</small><strong>{report.current.pm2_5 ?? '—'} <i>{report.units.pm2_5 || 'μg/m³'}</i></strong></div><div><small>PM10</small><strong>{report.current.pm10 ?? '—'} <i>{report.units.pm10 || 'μg/m³'}</i></strong></div></div></div>}
    <div className="air-disclaimer"><Info size={13}/><span>This is regional model context, not a street-level monitor, asthma trigger diagnosis, or personal health assessment. AQI scales vary by region. Source: <a href="https://open-meteo.com/en/docs/air-quality-api" target="_blank" rel="noreferrer">Open-Meteo</a> · CAMS ENSEMBLE.</span></div>
  </section></Localized>
}

function SymptomTrendCalendar({ journal, peakFlowEntries, language }) {
  const today = new Date()
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`)
  const dateKey = (value) => {
    const date = new Date(value)
    if (!Number.isFinite(date.getTime())) return ''
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }
  const grouped = useMemo(() => {
    const result = {}
    const getDay = (key) => { if (!result[key]) result[key] = { symptoms: [], readings: [] }; return result[key] }
    journal.forEach(entry => { const key = dateKey(entry.created_at); if (key) getDay(key).symptoms.push(entry) })
    peakFlowEntries.forEach(entry => { const key = dateKey(entry.recorded_at); if (key) getDay(key).readings.push(entry) })
    return result
  }, [journal, peakFlowEntries])
  const firstWeekday = month.getDay()
  const dayCount = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const cells = [...Array(firstWeekday).fill(null), ...Array.from({ length: dayCount }, (_, index) => index + 1)]
  const selectedDate = new Date(`${selected}T12:00:00`)
  const selectedData = grouped[selected] || { symptoms: [], readings: [] }
  const moveMonth = (step) => {
    const nextMonth = new Date(month.getFullYear(), month.getMonth() + step, 1)
    setMonth(nextMonth)
    setSelected(`${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-01`)
  }
  return <Localized language={language}><section className="trend-calendar panel" aria-label="Symptom trend calendar">
    <div className="trend-calendar-head"><div><div className="eyebrow muted">PERSONAL LOG OVERVIEW</div><h2>Symptom trend calendar</h2><p>Browse your own journal and peak-flow entries by date.</p></div><CalendarDays size={19}/></div>
    <div className="trend-month-nav"><button type="button" onClick={() => moveMonth(-1)} aria-label="Previous month">‹</button><strong>{month.toLocaleDateString(language === 'te' ? 'te-IN' : 'en-IN', { month: 'long', year: 'numeric' })}</strong><button type="button" onClick={() => moveMonth(1)} aria-label="Next month">›</button></div>
    <div className="trend-calendar-grid" role="grid" aria-label={month.toLocaleDateString(language === 'te' ? 'te-IN' : 'en-IN', { month: 'long', year: 'numeric' })}>{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => <span className="trend-weekday" role="columnheader" key={day}>{day}</span>)}{cells.map((day, index) => {
      if (!day) return <span className="trend-calendar-blank" role="gridcell" key={`blank-${index}`}/>
      const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const data = grouped[key]
      const active = key === selected
      return <button type="button" role="gridcell" aria-selected={active} aria-label={`${key}: ${data?.symptoms.length || 0} journal entries, ${data?.readings.length || 0} peak-flow readings`} className={`trend-day ${active ? 'selected' : ''} ${data && (data.symptoms.length || data.readings.length) ? 'has-records' : ''}`} key={key} onClick={() => setSelected(key)}><strong>{day}</strong>{data && <span className="trend-day-counts">{data.symptoms.length > 0 && <i className="symptom-dot">S{data.symptoms.length}</i>}{data.readings.length > 0 && <i className="flow-dot">P{data.readings.length}</i>}</span>}</button>
    })}</div>
    <div className="trend-legend"><span><i className="symptom-dot"/> Journal</span><span><i className="flow-dot"/> Peak flow</span></div>
    <div className="trend-day-detail"><div className="trend-detail-head"><h3>{selectedDate.toLocaleDateString(language === 'te' ? 'te-IN' : 'en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h3><span>{selectedData.symptoms.length} journal · {selectedData.readings.length} readings</span></div>
      {!selectedData.symptoms.length && !selectedData.readings.length ? <p className="trend-empty">No personal records for this date.</p> : <div className="trend-record-list">
        {selectedData.symptoms.map((entry, index) => <article className="trend-record symptom-record" key={`sym-${index}`}><strong><ClipboardList size={13}/>{entry.symptom || 'Symptom entry'}</strong><span>Severity {entry.severity ?? '—'} · {entry.possible_trigger || 'No trigger noted'}</span>{entry.notes && <small>{entry.notes}</small>}{entry.air_quality_context && <small className="trend-air-context">Air context: {entry.air_quality_context.location || 'Saved lookup'} · AQI {entry.air_quality_context.us_aqi ?? 'not available'}</small>}</article>)}
        {selectedData.readings.map(entry => <article className="trend-record flow-record" key={`flow-${entry.id}`}><strong><Wind size={13}/>Peak-flow reading</strong><span>{entry.value} L/min</span></article>)}
      </div>}
    </div>
    <div className="trend-safety"><Info size={13}/> This calendar organizes your entries only. It does not identify causes, interpret readings, or give medical advice.</div>
  </section></Localized>
}

function QuickCareCard({ open, onClose, carePlan, language }) {
  useEffect(() => {
    if (!open) return
    const handleKey = event => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])
  if (!open) return null
  const rows = [['Clinician / clinic', carePlan.clinician], ['Green zone · clinician notes', carePlan.green], ['Yellow zone · clinician notes', carePlan.yellow], ['Red zone · clinician notes', carePlan.red], ['Emergency contact', carePlan.emergency]]
  return <Localized language={language}><div className="care-card-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}><section className="quick-care-card" role="dialog" aria-modal="true" aria-labelledby="quick-care-title"><header><span className="quick-care-icon"><HeartPulse size={19}/></span><div><div className="eyebrow muted">QUICK ACCESS</div><h2 id="quick-care-title">My asthma care card</h2></div><button type="button" aria-label="Close care card" onClick={onClose}><X size={18}/></button></header><p className="quick-care-caption">Your notes and contact details, entered from a plan made with your clinician.</p><div className="quick-care-rows">{rows.map(([label, value]) => <article key={label}><strong>{label}</strong><p>{value?.trim() || 'Not added'}</p></article>)}</div><div className="quick-care-disclaimer"><ShieldCheck size={14}/> This card displays information you entered. It does not create emergency or treatment instructions. Follow your clinician-provided plan and contact local emergency services for an emergency.</div><footer><button type="button" className="care-tool-button" onClick={onClose}>Close card</button></footer></section></div></Localized>
}

function HelpCenter({ open, onClose, onAskGuide, language }) {
  const [city, setCity] = useState('')
  const [clinicianType, setClinicianType] = useState('pulmonologist')
  useEffect(() => {
    if (!open) return
    const handleKey = event => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])
  if (!open) return null
  const listingUrl = city.trim() ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${clinicianType} near ${city.trim()}`)}` : ''
  return <Localized language={language}><div className="help-center-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}><section className="help-center" role="dialog" aria-modal="true" aria-labelledby="help-center-title"><header><span className="help-center-icon"><CircleHelp size={20}/></span><div><div className="eyebrow muted">BREATHEWISE SUPPORT</div><h2 id="help-center-title">Need help?</h2></div><button type="button" aria-label="Close help" onClick={onClose}><X size={18}/></button></header><p className="help-center-intro">For general questions, use the guide or trusted sources. For personal care, contact a qualified clinician.</p><button className="help-guide-action" type="button" onClick={onAskGuide}><MessageCircle size={16}/> Ask the asthma guide <ArrowRight size={15}/></button><div className="help-provider-search"><h3><Stethoscope size={15}/> Find clinician listings</h3><p>Search public listings if you need to find another clinician.</p><label>Clinician type<select value={clinicianType} onChange={event => setClinicianType(event.target.value)}><option value="pulmonologist">Pulmonologist (lung specialist)</option><option value="allergist">Allergist</option><option value="primary care doctor">Primary care doctor</option><option value="hospital">Hospital</option></select></label><label>City or postal code<input value={city} onChange={event => setCity(event.target.value)} placeholder="Enter city or postal code" maxLength={100}/></label><a className={!listingUrl ? 'disabled' : ''} href={listingUrl || undefined} target="_blank" rel="noreferrer" onClick={event => { if (!listingUrl) event.preventDefault() }} aria-disabled={!listingUrl}>{listingUrl ? 'Open listings' : 'Enter a city to search'} <ExternalLink size={13}/></a><small>Listings are external and are not verified or endorsed by BreatheWise. Confirm credentials and availability directly.</small></div><div className="help-resources"><h3>Official asthma information</h3><a href="https://www.nhlbi.nih.gov/health/asthma/attacks" target="_blank" rel="noreferrer">Asthma attacks and urgent help <ExternalLink size={13}/></a><a href="https://www.nhlbi.nih.gov/health/asthma/treatment-action-plan" target="_blank" rel="noreferrer">Asthma action plan <ExternalLink size={13}/></a><a href="https://www.cdc.gov/asthma/emergency/index.html" target="_blank" rel="noreferrer">Emergency information <ExternalLink size={13}/></a></div><div className="help-emergency"><HeartPulse size={15}/><span>If breathing is very difficult, seek local emergency help now. Do not wait for this website or a routine appointment.</span></div><footer><button type="button" onClick={onClose}>Close help</button></footer></section></div></Localized>
}

function App() {
  const [values, setValues] = useState(initial)
  const [model, setModel] = useState('ensemble')
  const [overview, setOverview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [apiUp, setApiUp] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [page, setPage] = useState('Overview')
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('breathewise_theme') === 'dark' ? 'dark' : 'light' }
    catch { return 'light' }
  })
  const [language, setLanguage] = useState(() => { try { return localStorage.getItem('breathewise_language') === 'te' ? 'te' : 'en' } catch { return 'en' } })
  const [rememberOnDevice, setRememberOnDevice] = useState(false)
  const [personalDataLoaded, setPersonalDataLoaded] = useState(false)
  const [personalDataOwner, setPersonalDataOwner] = useState('')
  const [rememberError, setRememberError] = useState('')
  const [token, setToken] = useState(() => sessionStorage.getItem('breathewise_token') || '')
  const [user, setUser] = useState(() => { try { return JSON.parse(sessionStorage.getItem('breathewise_local_user') || 'null') } catch { return null } })
  const [authReady, setAuthReady] = useState(false)
  const [history, setHistory] = useState([])
  const [council, setCouncil] = useState([])
  const [councilProfile, setCouncilProfile] = useState('')
  const [councilLoading, setCouncilLoading] = useState(false)
  const [councilError, setCouncilError] = useState('')
  const [journal, setJournal] = useState([])
  const [journalDraft, setJournalDraft] = useState({ symptom: 'No symptoms', severity: 0, possible_trigger: 'None noted', night_waking: 'Not recorded', notes: '' })
  const [journalError, setJournalError] = useState('')
  const [airQualityContext, setAirQualityContext] = useState(null)
  const [includeAirQualityContext, setIncludeAirQualityContext] = useState(false)
  const [whatIfFeature, setWhatIfFeature] = useState('allergy')
  const [whatIfValue, setWhatIfValue] = useState(null)
  const [whatIfResult, setWhatIfResult] = useState(null)
  const [whatIfLoading, setWhatIfLoading] = useState(false)
  const [whatIfError, setWhatIfError] = useState('')
  const [peakFlowEntries, setPeakFlowEntries] = useState([])
  const [peakFlowReading, setPeakFlowReading] = useState('')
  const [peakFlowTime, setPeakFlowTime] = useState(localDateTimeValue)
  const [peakFlowError, setPeakFlowError] = useState('')
  const [trustData, setTrustData] = useState(null)
  const [trustLoading, setTrustLoading] = useState(false)
  const [trustError, setTrustError] = useState('')
  const [trustFeature, setTrustFeature] = useState('age')
  const [trustBin, setTrustBin] = useState(null)
  const [trustSlice, setTrustSlice] = useState('age_group')
  const [sweepFeature, setSweepFeature] = useState('allergy')
  const [sweepResult, setSweepResult] = useState(null)
  const [sweepLoading, setSweepLoading] = useState(false)
  const [sweepError, setSweepError] = useState('')
  const [carePlan, setCarePlan] = useState({ clinician: '', green: '', yellow: '', red: '', emergency: '' })
  const [medications, setMedications] = useState([])
  const [medDraft, setMedDraft] = useState({ name: '', time: '' })
  const [reminderNotice, setReminderNotice] = useState(null)
  const [notificationPermission, setNotificationPermission] = useState(() => typeof Notification === 'undefined' ? 'unsupported' : Notification.permission)
  const reminderCheckRef = useRef(new Date())
  const remindedTodayRef = useRef(new Set())
  const [careSaved, setCareSaved] = useState(false)
  const [careCardOpen, setCareCardOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [chatOpenRequest, setChatOpenRequest] = useState(0)

  useEffect(() => {
    try { localStorage.setItem('breathewise_theme', theme) } catch {}
  }, [theme])

  useEffect(() => { try { localStorage.setItem('breathewise_language', language) } catch {} }, [language])

  useEffect(() => {
    fetch(`${API}/api/overview`).then(r => r.json()).then(d => { setOverview(d); setApiUp(true) }).catch(() => setApiUp(false))
    if (!token) { setAuthReady(true); return }
    fetch(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } }).then(r => { if (!r.ok) throw new Error('Session ended'); return r.json() }).then(d => { let localUser = null; try { localUser = JSON.parse(sessionStorage.getItem('breathewise_local_user') || 'null') } catch {} setUser(localUser || d.user); setAuthReady(true) }).catch(() => { sessionStorage.removeItem('breathewise_token'); setToken(''); setAuthReady(true) })
  }, [token])

  useEffect(() => {
    // Local browser accounts still need a temporary API token for demo predictions.
    // The API's guest token does not save results to a MongoDB account.
    if (!user || token) return
    let active = true
    createGuestApiSession().then(payload => {
      if (!active) return
      sessionStorage.setItem('breathewise_token', payload.token)
      setToken(payload.token)
    }).catch(() => {})
    return () => { active = false }
  }, [user?.email, token])

  useEffect(() => {
    if (!user || !token || user.auth_type === 'local' || user.is_guest) return
    const headers = { Authorization: `Bearer ${token}` }
    fetch(`${API}/api/history`, { headers }).then(r => r.ok ? r.json() : null).then(d => { if (d?.items) setHistory(d.items) }).catch(() => {})
    fetch(`${API}/api/journal`, { headers }).then(r => r.ok ? r.json() : null).then(d => { if (d?.items) setJournal(d.items) }).catch(() => {})
  }, [user?.email, token])

  useEffect(() => {
    setPersonalDataLoaded(false)
    if (!user?.email) { setJournal([]); setPeakFlowEntries([]); setCarePlan({ clinician: '', green: '', yellow: '', red: '', emergency: '' }); setMedications([]); setRememberOnDevice(false); return }
    const canRemember = !user.is_guest
    let remembered = false
    try { remembered = canRemember && localStorage.getItem(`breathewise_remember_${user.email}`) === 'true' } catch {}
    setRememberOnDevice(remembered)
    const read = (baseKey, fallback) => {
      try {
        const raw = remembered ? localStorage.getItem(`${baseKey}_${user.email}`) : null
        return JSON.parse(raw || sessionStorage.getItem(`${baseKey}_${user.email}`) || JSON.stringify(fallback))
      } catch { return fallback }
    }
    const care = read('breathewise_care', {})
    setCarePlan({ clinician: '', green: '', yellow: '', red: '', emergency: '', ...(care.plan || {}) })
    setMedications(Array.isArray(care.medications) ? care.medications : [])
    setPeakFlowEntries(read('breathewise_peak_flow', []))
    setJournal(read('breathewise_journal', []))
    setPersonalDataOwner(user.email)
    setPersonalDataLoaded(true)
  }, [user?.email, user?.is_guest, user?.auth_type])

  useEffect(() => {
    if (!personalDataLoaded || !user?.email || personalDataOwner !== user.email) return
    const records = {
      breathewise_journal: journal,
      breathewise_peak_flow: peakFlowEntries,
      breathewise_care: { plan: carePlan, medications },
    }
    try {
      for (const [base, data] of Object.entries(records)) {
        const serialized = JSON.stringify(data)
        sessionStorage.setItem(`${base}_${user.email}`, serialized)
        if (rememberOnDevice && !user.is_guest) localStorage.setItem(`${base}_${user.email}`, serialized)
      }
    } catch { setRememberError('Browser storage is full or unavailable. Your current notes remain open for this session.') }
  }, [personalDataLoaded, personalDataOwner, user?.email, user?.is_guest, rememberOnDevice, journal, peakFlowEntries, carePlan, medications])

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()
      const previous = reminderCheckRef.current
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
      for (const reminder of medications) {
        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(reminder.time || '')) continue
        const [hours, minutes] = reminder.time.split(':').map(Number)
        const due = new Date(now)
        due.setHours(hours, minutes, 0, 0)
        const key = `${today}:${reminder.id}`
        if (previous < due && now >= due && now.getTime() - due.getTime() < 5 * 60 * 1000 && !remindedTodayRef.current.has(key)) {
          remindedTodayRef.current.add(key)
          setReminderNotice({ id: key, name: reminder.name, time: reminder.time })
          if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            new Notification('BreatheWise reminder', { body: reminder.name, tag: key })
          }
        }
      }
      reminderCheckRef.current = now
    }
    const timer = window.setInterval(checkReminders, 5000)
    return () => window.clearInterval(timer)
  }, [medications])

  useEffect(() => {
    if (!reminderNotice) return
    const timer = window.setTimeout(() => setReminderNotice(null), 15000)
    return () => window.clearTimeout(timer)
  }, [reminderNotice])

  useEffect(() => {
    if (!apiUp) return
    let current = true
    setTrustLoading(true); setTrustError('')
    fetch(`${API}/api/data/trust`).then(async response => {
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Dataset summary unavailable.')
      return payload
    }).then(payload => { if (current) setTrustData(payload) }).catch(e => { if (current) setTrustError(e.message || 'Could not load the synthetic dataset summary.') }).finally(() => { if (current) setTrustLoading(false) })
    return () => { current = false }
  }, [apiUp])

  const acceptAuth = (payload) => { if (payload.token) { sessionStorage.setItem('breathewise_token', payload.token); setToken(payload.token) } else { sessionStorage.removeItem('breathewise_token'); setToken('') }; sessionStorage.setItem('breathewise_local_user', JSON.stringify(payload.user)); setUser(payload.user); setAuthReady(true) }
  const signOut = () => { sessionStorage.removeItem('breathewise_token'); sessionStorage.removeItem('breathewise_local_user'); setToken(''); setUser(null); setResult(null); setHistory([]); setJournal([]) }
  const toggleRememberOnDevice = (enabled) => {
    if (!user?.email || user.is_guest) return
    const preferenceKey = `breathewise_remember_${user.email}`
    const recordKeys = ['breathewise_journal', 'breathewise_peak_flow', 'breathewise_care'].map(base => `${base}_${user.email}`)
    setRememberError('')
    try {
      if (enabled) {
        localStorage.setItem(preferenceKey, 'true')
        setRememberOnDevice(true)
      } else {
        localStorage.removeItem(preferenceKey)
        recordKeys.forEach(key => localStorage.removeItem(key))
        setRememberOnDevice(false)
      }
    } catch { setRememberError('Could not update browser storage. Your current notes remain available for this session.') }
  }

  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError('')
    try {
      const body = JSON.stringify({ model, features: values })
      const requestPrediction = (authToken) => fetch(`${API}/api/predict`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` }, body })
      let activeToken = token
      if (!activeToken) {
        const session = await createGuestApiSession()
        activeToken = session.token
        sessionStorage.setItem('breathewise_token', activeToken)
        setToken(activeToken)
      }
      let response = await requestPrediction(activeToken)
      if (response.status === 401) {
        // A backend restart or changed JWT secret can invalidate a token kept in this tab.
        // Refresh the temporary research token and retry this demo request once.
        const session = await createGuestApiSession()
        activeToken = session.token
        sessionStorage.setItem('breathewise_token', activeToken)
        setToken(activeToken)
        response = await requestPrediction(activeToken)
      }
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Prediction request failed')
      setResult(payload)
      setHistory([{ ...payload }, ...history].slice(0, 8))
    } catch (e) { setError(apiUp ? e.message : 'API is offline. Start the Flask service to run a demo prediction.') }
    finally { setLoading(false) }
  }

  const runModelCouncil = async () => {
    const modelIds = (overview?.models || []).map(item => item.id)
    if (!modelIds.length) { setCouncilError('No models are available. Check that the Flask API is running.'); return }
    setCouncilLoading(true); setCouncilError(''); setCouncil([])
    const outputs = []
    try {
      for (const id of modelIds) {
        const response = await fetch(`${API}/api/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ model: id, features: values }),
        })
        const payload = await response.json()
        if (response.ok) outputs.push(payload)
      }
      if (!outputs.length) throw new Error('The models could not return any demo outputs.')
      setCouncil(outputs)
      setCouncilProfile(JSON.stringify(values))
      setHistory(current => [...outputs, ...current].slice(0, 8))
    } catch (e) { setCouncilError(e.message || 'Could not compare models. Check the Flask terminal.') }
    finally { setCouncilLoading(false) }
  }

  const ranked = useMemo(() => [...(result?.explanations || [])].sort((a, b) => Math.abs(b.value) - Math.abs(a.value)).slice(0, 5), [result])
  const maxImpact = Math.max(0.01, ...ranked.map(x => Math.abs(x.value)))
  const models = overview?.models || []
  const councilIsCurrent = council.length > 0 && councilProfile === JSON.stringify(values)
  const councilSpread = council.length > 1
    ? Math.round((Math.max(...council.map(item => item.probability)) - Math.min(...council.map(item => item.probability))) * 100)
    : 0
  const councilFeatures = Object.entries(council.reduce((counts, output) => {
    ;[...(output.explanations || [])].sort((a, b) => Math.abs(b.value) - Math.abs(a.value)).slice(0, 3)
      .forEach(item => { counts[item.feature] = (counts[item.feature] || 0) + 1 })
    return counts
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 4)
  const whatIfOptions = [
    ['allergy', 'Known allergies', 0, 1, 1], ['wheezing', 'Recent wheezing', 0, 1, 1],
    ['night_symptoms', 'Night symptoms', 0, 1, 1], ['exercise_trigger', 'Exercise-triggered symptoms', 0, 1, 1],
    ['smoking', 'Current smoker', 0, 1, 1], ['air_quality', 'Air quality exposure', 0, 3, 1],
    ['respiratory_infections', 'Respiratory infections', 0, 5, 1], ['age', 'Age', 18, 100, 1], ['bmi', 'Body mass index', 10, 70, 0.1],
  ]
  const whatIfDefinition = whatIfOptions.find(([key]) => key === whatIfFeature) || whatIfOptions[0]
  const whatIfOriginal = values[whatIfFeature]
  const whatIfSelected = whatIfValue ?? whatIfOriginal
  const whatIfIsCurrent = Boolean(whatIfResult) && whatIfResult.profile === JSON.stringify(values) && whatIfResult.model === model && whatIfResult.feature === whatIfFeature && Number(whatIfResult.testValue) === Number(whatIfSelected)
  const sweepIsCurrent = Boolean(sweepResult) && sweepResult.profile === JSON.stringify(values) && sweepResult.feature === sweepFeature
  const journalInsights = useMemo(() => {
    const countBy = (key) => Object.entries(journal.reduce((counts, entry) => {
      const value = entry[key]
      if (value && value !== 'None noted' && value !== 'No symptoms') counts[value] = (counts[value] || 0) + 1
      return counts
    }, {})).sort((a, b) => b[1] - a[1])[0]
    const triggerList = Object.entries(journal.reduce((counts, entry) => {
      const value = entry.possible_trigger
      if (value && value !== 'None noted') counts[value] = (counts[value] || 0) + 1
      return counts
    }, {})).sort((a, b) => b[1] - a[1])
    return { count: journal.length, symptom: countBy('symptom'), trigger: countBy('possible_trigger'), triggerList }
  }, [journal])
  const timelineItems = useMemo(() => [
    ...journal.map((entry, index) => ({ kind: 'journal', id: `journal-${entry.created_at || index}-${index}`, recordedAt: entry.created_at, entry })),
    ...peakFlowEntries.map(entry => ({ kind: 'peak-flow', id: `peak-${entry.id}`, recordedAt: entry.recorded_at, entry })),
  ].sort((a, b) => new Date(b.recordedAt || 0) - new Date(a.recordedAt || 0)).slice(0, 12), [journal, peakFlowEntries])
  const trustFeatureOptions = fields.map(([key, label]) => [key, label])
  const trustDistribution = useMemo(() => {
    const rows = trustData?.rows || []
    if (!rows.length) return []
    const entries = rows.map(row => ({ value: Number(row[trustFeature]), label: Number(row.asthma_label_synthetic) }))
    const defineBucket = (value) => {
      if (trustFeature === 'age') return value < 30 ? '18–29' : value < 40 ? '30–39' : value < 50 ? '40–49' : value < 60 ? '50–59' : value < 70 ? '60–69' : '70+'
      if (trustFeature === 'bmi') return value < 20 ? '<20' : value < 25 ? '20–24.9' : value < 30 ? '25–29.9' : '30+'
      if (trustFeature === 'air_quality') return ['Low', 'Moderate', 'Elevated', 'High'][value] || String(value)
      if (['smoking', 'family_history', 'allergy', 'wheezing', 'night_symptoms', 'exercise_trigger'].includes(trustFeature)) return value ? 'Yes' : 'No'
      return String(value)
    }
    const bins = entries.reduce((summary, entry) => {
      const label = defineBucket(entry.value)
      if (!summary[label]) summary[label] = { label, count: 0, positives: 0 }
      summary[label].count += 1
      summary[label].positives += entry.label
      return summary
    }, {})
    const sortOrder = trustFeature === 'air_quality' ? ['Low', 'Moderate', 'Elevated', 'High'] : trustFeature === 'age' ? ['18–29', '30–39', '40–49', '50–59', '60–69', '70+'] : trustFeature === 'bmi' ? ['<20', '20–24.9', '25–29.9', '30+'] : undefined
    return Object.values(bins).sort((a, b) => sortOrder ? sortOrder.indexOf(a.label) - sortOrder.indexOf(b.label) : Number(a.label) - Number(b.label)).map(bin => ({ ...bin, positiveRate: bin.count ? bin.positives / bin.count : 0 }))
  }, [trustData, trustFeature])
  const selectedTrustBin = trustDistribution.find(bin => bin.label === trustBin)
  const trustSliceRows = (trustData?.slices || []).filter(item => item.slice === trustSlice)
  const plainExplanation = useMemo(() => {
    if (!result) return null
    const explanations = result.explanations || []
    return {
      upward: [...explanations].filter(item => item.value > 0).sort((a, b) => b.value - a.value).slice(0, 2),
      downward: [...explanations].filter(item => item.value < 0).sort((a, b) => a.value - b.value).slice(0, 2),
    }
  }, [result])
  const addPeakFlowEntry = (event) => {
    event.preventDefault()
    const value = Number(peakFlowReading)
    if (!Number.isFinite(value) || value <= 0 || !peakFlowTime) { setPeakFlowError('Enter a positive reading and the time it was measured.'); return }
    const entry = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, value, recorded_at: new Date(peakFlowTime).toISOString() }
    const next = [entry, ...peakFlowEntries].slice(0, 30)
    setPeakFlowEntries(next)
    if (user?.email) sessionStorage.setItem(`breathewise_peak_flow_${user.email}`, JSON.stringify(next))
    setPeakFlowReading('')
    setPeakFlowTime(localDateTimeValue())
    setPeakFlowError('')
  }
  const removePeakFlowEntry = (id) => {
    const next = peakFlowEntries.filter(entry => entry.id !== id)
    setPeakFlowEntries(next)
    if (user?.email) sessionStorage.setItem(`breathewise_peak_flow_${user.email}`, JSON.stringify(next))
  }

  const runModelSweep = async () => {
    if (!apiUp) { setSweepError('The Flask API is offline. Start it before comparing models.'); return }
    setSweepLoading(true); setSweepError(''); setSweepResult(null)
    try {
      const response = await fetch(`${API}/api/model-sweep`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ feature: sweepFeature, features: values }) })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'The model sweep could not be created.')
      setSweepResult({ ...payload, profile: JSON.stringify(values) })
    } catch (e) { setSweepError(e.message || 'Could not compare these models. Check the Flask terminal.') }
    finally { setSweepLoading(false) }
  }

  const compareWhatIf = async () => {
    if (!apiUp) { setWhatIfError('The Flask API is offline. Start it before comparing outputs.'); return }
    setWhatIfLoading(true); setWhatIfError(''); setWhatIfResult(null)
    const originalValue = values[whatIfFeature]
    const testValue = Number(whatIfSelected)
    const requestPrediction = async (features) => {
      const response = await fetch(`${API}/api/predict`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ model, features }) })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'A model output could not be created.')
      return payload
    }
    try {
      const base = await requestPrediction(values)
      const changed = await requestPrediction({ ...values, [whatIfFeature]: testValue })
      setWhatIfResult({ base, changed, feature: whatIfFeature, testValue, originalValue, profile: JSON.stringify(values), model })
      setHistory(current => [changed, base, ...current].slice(0, 8))
    } catch (e) { setWhatIfError(e.message || 'Could not compare these outputs. Check the Flask terminal.') }
    finally { setWhatIfLoading(false) }
  }

  if (!authReady) return <div className="auth-loading">Preparing your workspace…</div>
  if (!user) return <FrontendAccountGate onSuccess={acceptAuth} theme={theme} onToggleTheme={() => setTheme(current => current === 'dark' ? 'light' : 'dark')} language={language} onLanguageChange={setLanguage} />

  const saveJournalEntry = async (event) => {
    event.preventDefault(); setJournalError('')
    const entryDraft = { ...journalDraft, air_quality_context: includeAirQualityContext ? airQualityContext : null }
    if (user.is_guest || user.auth_type === 'local') {
      setJournal([{ ...entryDraft, created_at: new Date().toISOString() }, ...journal].slice(0, 12))
      setJournalDraft({ symptom: 'No symptoms', severity: 0, possible_trigger: 'None noted', night_waking: 'Not recorded', notes: '' })
      setIncludeAirQualityContext(false)
      return
    }
    try {
      const response = await fetch(`${API}/api/journal`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(entryDraft) })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Could not save this entry.')
      setJournal([payload.entry, ...journal].slice(0, 12))
      setJournalDraft({ symptom: 'No symptoms', severity: 0, possible_trigger: 'None noted', night_waking: 'Not recorded', notes: '' })
      setIncludeAirQualityContext(false)
    } catch (e) { setJournalError(e.message || 'Could not save the entry. Check that MongoDB is running.') }
  }

  const saveCareTools = (plan = carePlan, meds = medications) => {
    if (!user?.email) return
    try {
      sessionStorage.setItem(`breathewise_care_${user.email}`, JSON.stringify({ plan, medications: meds }))
      if (rememberOnDevice && !user.is_guest) localStorage.setItem(`breathewise_care_${user.email}`, JSON.stringify({ plan, medications: meds }))
      setCareSaved(true)
      window.setTimeout(() => setCareSaved(false), 2200)
    } catch { setCareSaved(false) }
  }

  const addMedicationReminder = (event) => {
    event.preventDefault()
    if (!medDraft.name.trim() || !medDraft.time) return
    const next = [...medications, { id: `${Date.now()}`, name: medDraft.name.trim(), time: medDraft.time }]
    setMedications(next); saveCareTools(carePlan, next); setMedDraft({ name: '', time: '' })
  }

  const removeMedicationReminder = (id) => {
    const next = medications.filter(entry => entry.id !== id)
    setMedications(next); saveCareTools(carePlan, next)
  }

  const openGoogleCalendarReminder = (item) => {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(item.time || '')) return
    const [hours, minutes] = item.time.split(':').map(Number)
    const start = new Date()
    start.setHours(hours, minutes, 0, 0)
    if (start <= new Date()) start.setDate(start.getDate() + 1)
    const end = new Date(start)
    end.setMinutes(end.getMinutes() + 5)
    const googleDate = date => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: item.name || 'BreatheWise reminder',
      dates: `${googleDate(start)}/${googleDate(end)}`,
      ctz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      recur: 'RRULE:FREQ=DAILY',
      details: 'A reminder you created in BreatheWise. Follow your existing clinician-provided instructions.'
    })
    window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank', 'noopener,noreferrer')
  }

  const enableReminderNotifications = async () => {
    if (typeof Notification === 'undefined') { setNotificationPermission('unsupported'); return }
    try {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
    } catch { setNotificationPermission('denied') }
  }

  const exportAppointmentSummary = () => {
    const lines = [
      'BREATHEWISE | SYMPTOM, EXPOSURE & PEAK-FLOW SUMMARY',
      `Created: ${new Date().toLocaleString()}`,
      'For discussion with a qualified healthcare professional. User-recorded information only; not a diagnosis, causal analysis, or treatment recommendation.',
      '', 'SYMPTOM & EXPOSURE JOURNAL',
      ...(journal.length ? journal.slice(0, 12).flatMap((entry, index) => [
        `${index + 1}. ${entry.created_at ? new Date(entry.created_at).toLocaleString() : 'Date not recorded'}`,
        `   Symptom: ${entry.symptom || 'Not recorded'} | Severity: ${['None', 'Mild', 'Moderate', 'High'][Number(entry.severity)] || 'Not recorded'}`,
        `   Possible trigger noted: ${entry.possible_trigger || 'Not recorded'} | Night waking: ${entry.night_waking || 'Not recorded'}`,
        ...(entry.air_quality_context ? [`   Air-quality regional estimate: ${entry.air_quality_context.location || 'Location not recorded'} | US AQI: ${entry.air_quality_context.us_aqi ?? 'not available'} | PM2.5: ${entry.air_quality_context.pm2_5 ?? 'not available'} | PM10: ${entry.air_quality_context.pm10 ?? 'not available'} | Source time: ${entry.air_quality_context.report_time ? new Date(entry.air_quality_context.report_time).toLocaleString() : 'Not recorded'}`] : []),
        ...(entry.notes ? [`   Note: ${entry.notes}`] : []), '',
      ]) : ['No symptom journal entries recorded.', '']),
      'PEAK-FLOW METER RECORDS',
      ...(peakFlowEntries.length ? peakFlowEntries.slice(0, 30).map(entry => `- ${entry.recorded_at ? new Date(entry.recorded_at).toLocaleString() : 'Date not recorded'} | ${entry.value} L/min`) : ['No peak-flow readings recorded.']),
      '', 'CLINICIAN-PROVIDED PLAN NOTES (entered by the user)',
      `Clinician or clinic: ${carePlan.clinician || 'Not recorded'}`,
      `Green zone notes: ${carePlan.green || 'Not recorded'}`,
      `Yellow zone notes: ${carePlan.yellow || 'Not recorded'}`,
      `Red zone notes: ${carePlan.red || 'Not recorded'}`,
      `Emergency contact: ${carePlan.emergency || 'Not recorded'}`,
      '', 'Questions to discuss:', '- What might be contributing to these symptoms or exposures?', '- Should my asthma action plan or monitoring approach be reviewed?',
      '', 'This report contains personal information. Review it before sharing. The BreatheWise model uses synthetic data and is not clinically validated.',
    ]
    const blob = createReportPdf(lines)
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a')
    anchor.href = url; anchor.download = 'breathewise-health-summary.pdf'; anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const applyScenario = (scenario) => {
    setValues({ ...initial, ...scenario.values })
    setResult(null)
    document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const exportResult = () => {
    if (!result) return
    const report = {
      title: 'BreatheWise synthetic research demo output',
      disclaimer: 'Not a diagnosis or personal medical risk estimate. This model uses synthetic training data and is not clinically validated.',
      model: MODEL_LABEL(result.model), algorithm: MODEL_METHOD(result.model), explanation_method: result.explanation_method,
      created_at: result.created_at, demo_score: result.probability,
      example_inputs: values, strongest_model_influences: ranked,
    }
    const file = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(file)
    const anchor = document.createElement('a')
    anchor.href = url; anchor.download = 'breathewise-demo-explanation.json'; anchor.click()
    URL.revokeObjectURL(url)
  }

  return <Localized language={language}><div className={`${user.is_guest ? 'shell guest-shell' : 'shell'} theme-${theme}`}>
    <aside className={`sidebar ${mobileNav ? 'nav-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Wind size={21}/></div><span>breathe<span className="brand-light">wise</span></span><button className="close-nav" onClick={() => setMobileNav(false)}><X size={19}/></button></div>
      <div className="workspace-tag">RESEARCH WORKSPACE</div>
      <nav>
        {[['Overview', LayoutDashboard, 'top'], ['Risk assessment', Activity, 'assessment'], ['What-if lab', Zap, 'whatif'], ['Model council', BarChart3, 'council'], ['Model map', Activity, 'model-map'], ['Peak flow diary', Wind, 'peak-flow-diary'], ['Data trust lab', Database, 'data-trust'], ['Air quality', Wind, 'air-quality'], ['Inhaler learning', BookOpen, 'inhaler-learning'], ['Care toolkit', HeartPulse, 'care-toolkit'], ['My journal', ClipboardList, 'journal'], ['Data library', Database, 'data']].map(([label, Icon, target]) => <button key={label} className={`nav-item ${page === label ? 'active' : ''}`} onClick={() => { setPage(label); setMobileNav(false); document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }) }}><Icon size={18}/><span>{label}</span>{label === 'Risk assessment' && <span className="nav-dot"/>}</button>)}
      </nav>
      <div className="side-bottom"><div className="help-card"><div className="help-icon"><BookOpen size={16}/></div><div><strong>New to the project?</strong><span>Read the model guide</span></div><ArrowRight size={15}/></div><div className="profile"><div className="avatar">{(user.name || 'BW').slice(0, 2).toUpperCase()}</div><div className="profile-copy"><strong>{user.name}</strong><span>{user.email}</span></div><button className="signout-button" title="Sign out" onClick={signOut}><LogOut size={16}/></button></div></div>
    </aside>
    {mobileNav && <button className="scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)}/>}
    <main className="main" id="top">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(true)}><Menu size={20}/></button><div className="crumb">Workspace <span>/</span> <strong>{page}</strong></div><div className="top-actions"><div className={`connection ${apiUp ? 'online' : ''}`}><span/>{apiUp ? 'API connected' : 'API offline'}</div><button type="button" className="care-card-shortcut" onClick={() => setCareCardOpen(true)}><HeartPulse size={14}/> Care card</button><label className="language-picker compact-language"><Languages size={15}/><select aria-label="Language" value={language} onChange={event => setLanguage(event.target.value)}><option value="en">English</option><option value="te">తెలుగు</option></select></label><button className="help-shortcut" type="button" onClick={() => setHelpOpen(true)}><CircleHelp size={17}/><span>Help</span></button><button className="theme-toggle icon-button" type="button" title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}</button><div className="avatar avatar-small">BW</div></div></header>
      <div className="content">
        <section className="welcome"><div><div className="eyebrow"><Sparkles size={14}/> EXPLAINABLE ML · ASTHMA RESEARCH</div><h1>Understand the signals.<br/><span>Explore the model.</span></h1><p>A transparent, educational workspace for exploring asthma-related risk factors and machine learning explanations.</p></div><div className="welcome-art"><div className="art-circle"><div className="art-core"><Wind size={35}/></div><span className="orbit o1"/><span className="orbit o2"/><i className="bubble b1"/><i className="bubble b2"/><i className="bubble b3"/></div></div></section>
        <div className="notice"><Info size={17}/><span><strong>Research demo only.</strong> Uses synthetic data and is not clinically validated. Do not use for diagnosis or care decisions.</span><button onClick={() => document.getElementById('data').scrollIntoView({ behavior: 'smooth' })}>About the data <ArrowRight size={14}/></button></div>
        {reminderNotice && <div className="reminder-popup" role="alert"><span className="reminder-popup-icon"><Bell size={17}/></span><div><strong>Reminder</strong><p>{reminderNotice.name} · {reminderNotice.time}</p><small>Follow the instructions provided by your healthcare professional.</small></div><button type="button" aria-label="Dismiss reminder" onClick={() => setReminderNotice(null)}><X size={16}/></button></div>}
        {language === 'te' && <div className="language-note">{TE['Some medical details and source material are shown in English to preserve the original clinical wording.']}</div>}
        <div className="section-heading"><div><div className="eyebrow muted">YOUR WORKSPACE</div><h2>Model overview</h2></div><span className="updated"><span className={apiUp ? 'live-dot' : 'live-dot idle'}/>{apiUp ? 'Models ready' : 'Waiting for API'}</span></div>
        <section className="metric-grid" id="models">
          <article className="metric-card"><div className="metric-top"><span>Available models</span><div className="metric-icon mint"><Activity size={17}/></div></div><div className="metric-value">{models.length || 3}<span className="metric-unit"> models</span></div><div className="metric-foot">Three approaches, one comparison view</div></article>
          <article className="metric-card"><div className="metric-top"><span>Demo dataset</span><div className="metric-icon blue"><Database size={17}/></div></div><div className="metric-value">{overview?.dataset?.rows?.toLocaleString() || '1,200'}<span className="metric-unit"> records</span></div><div className="metric-foot">Synthetic · generated for this project</div></article>
          <article className="metric-card"><div className="metric-top"><span>Input features</span><div className="metric-icon peach"><BarChart3 size={17}/></div></div><div className="metric-value">10<span className="metric-unit"> factors</span></div><div className="metric-foot">Symptoms, history & environment</div></article>
          <article className="metric-card metric-note"><div className="metric-top"><span>Interpretability</span><div className="metric-icon lilac"><Sparkles size={17}/></div></div><div className="metric-value small-value">SHAP <span className="metric-unit">explanations</span></div><div className="metric-foot">See which inputs influenced a demo output</div></article>
        </section>

        <section className="starter-panel" aria-labelledby="starter-heading">
          <div className="starter-head"><div className="starter-title"><span className="starter-head-icon"><Sparkles size={17}/></span><div><div className="eyebrow muted">START WITH AN EXAMPLE</div><h2 id="starter-heading">Explore a sample profile</h2></div></div><button className="subtle-action" onClick={() => { setValues(initial); setResult(null) }}><RotateCcw size={14}/> Reset inputs</button></div>
          <div className="starter-grid">
            <button className="starter-card" onClick={() => applyScenario({ values: { age: 29, bmi: 23.4, family_history: 1, allergy: 1, air_quality: 1 } })}><span className="starter-icon mint"><Leaf size={18}/></span><span className="starter-text"><strong>Allergy example</strong><small>Explore a sample profile with allergy history</small></span><ArrowRight size={16}/></button>
            <button className="starter-card" onClick={() => applyScenario({ values: { age: 42, bmi: 25.1, wheezing: 1, exercise_trigger: 1, air_quality: 0 } })}><span className="starter-icon blue"><Zap size={18}/></span><span className="starter-text"><strong>Exercise example</strong><small>Explore a sample profile with exercise triggers</small></span><ArrowRight size={16}/></button>
            <button className="starter-card" onClick={() => applyScenario({ values: { age: 51, bmi: 27.2, smoking: 1, air_quality: 3, respiratory_infections: 2 } })}><span className="starter-icon peach"><Stethoscope size={18}/></span><span className="starter-text"><strong>Environment example</strong><small>Explore a sample profile with exposure inputs</small></span><ArrowRight size={16}/></button>
          </div>
          <div className="starter-foot"><BadgeInfo size={14}/> These profiles are made up for interface exploration. They do not represent people or clinical guidance.</div>
        </section>

        <section className="assessment-layout" id="assessment">
          <div className="panel form-panel"><div className="panel-heading"><div><div className="eyebrow muted">INTERACTIVE EXPLORATION</div><h2>Risk factor explorer</h2><p>Adjust the example profile to explore model behavior.</p></div><div className="form-icon"><HeartPulse size={20}/></div></div>
            <form onSubmit={submit}><div className="field-grid">{fields.map(([key, label, hint, type]) => <label className={`field ${type === 'toggle' ? 'toggle-field' : ''}`} key={key}><span className="field-name">{label}{hint && <small>{hint}</small>}</span>{type === 'toggle' ? <button type="button" className={`switch ${values[key] ? 'checked' : ''}`} role="switch" aria-checked={!!values[key]} aria-label={label} onClick={() => setValues({ ...values, [key]: values[key] ? 0 : 1 })}><span/></button> : type === 'select' ? <select value={values[key]} onChange={e => setValues({ ...values, [key]: Number(e.target.value) })}><option value={0}>Low</option><option value={1}>Moderate</option><option value={2}>Elevated</option><option value={3}>High</option></select> : <input type="number" min={key === 'age' ? 18 : key === 'bmi' ? 10 : 0} max={key === 'age' ? 100 : key === 'bmi' ? 70 : 5} step={key === 'bmi' ? 0.1 : 1} value={values[key]} onChange={e => setValues({ ...values, [key]: Number(e.target.value) })}/>}</label>)}</div>
              <div className="model-picker"><label htmlFor="model">Model</label><select id="model" value={model} onChange={e => setModel(e.target.value)}>{[['ensemble','BreatheWise Model Ensemble · equal average'],['random_forest','Airway Pattern Forest · Random Forest'],['logistic_regression','Respiratory Linear Model · Logistic Regression'],['xgboost','Pulmonary Gradient Model · XGBoost']].map(([id,name]) => <option key={id} value={id}>{name}</option>)}</select><span className="picker-spark"><Sparkles size={15}/></span></div>
              {error && <div className="error-box"><Info size={16}/>{error}</div>}
              <div className="form-actions"><button className="primary-button" disabled={loading}>{loading ? 'Exploring…' : 'Explore demo output'}{loading ? <span className="spinner"/> : <ArrowRight size={17}/>}</button><span className="private-note"><ShieldCheck size={14}/> Example inputs stay in this browser</span></div>
            </form>
          </div>
          <div className="panel result-panel"><div className="panel-heading result-heading"><div><div className="eyebrow muted">MODEL OUTPUT</div><h2>What the model noticed</h2></div><span className="result-badge"><Sparkles size={13}/> {result?.explanation_method || 'SHAP'}</span></div>
            {result ? <><div className="result-summary"><div className="score-ring" style={{'--score': `${result.probability * 100}%`}}><div><strong>{Math.round(result.probability * 100)}<small>%</small></strong><span>{result.model === 'ensemble' ? 'combined demo score' : 'demo score'}</span></div></div><div className="result-copy"><strong>{MODEL_LABEL(result.model)}</strong><span>{MODEL_METHOD(result.model)}</span><p>Illustrative score only · not a medical estimate</p></div></div>{result.component_scores?.length > 0 && <div className="ensemble-components"><div className="ensemble-components-title"><BarChart3 size={14}/> Model scores included in the average</div><div>{result.component_scores.map(item => <span key={item.model}><b>{MODEL_LABEL(item.model)}</b><small>{MODEL_METHOD(item.model)}</small><strong>{Math.round(item.probability * 100)}%</strong></span>)}</div><small>Combined score = (Random Forest + Logistic Regression + XGBoost) ÷ 3</small></div>}<div className="impact-title"><span>{result.model === 'ensemble' ? 'Combined model influences' : 'Strongest model influences'}</span><Info size={14}/></div><div className="impact-list">{ranked.map((item, i) => <div className="impact-row" key={item.feature}><div className="impact-label"><span>{item.feature}</span><b>{item.value >= 0 ? '+' : ''}{item.value.toFixed(3)}</b></div><div className="bar-track"><div className={`bar-fill ${item.value < 0 ? 'negative' : ''}`} style={{width:`${Math.max(7, Math.abs(item.value) / maxImpact * 100)}%`,opacity:1-i*.09}}/></div></div>)}</div><div className="plain-explainer"><div><span className="plain-icon"><Sparkles size={15}/></span><strong>In plain language</strong></div><p>{plainExplanation?.upward.length ? <>For this example, <b>{plainExplanation.upward.map(item => item.feature.toLowerCase()).join(' and ')}</b> had the largest positive contributions to the model output. </> : 'No positive feature contribution stood out in this explanation. '}{plainExplanation?.downward.length ? <><b>{plainExplanation.downward.map(item => item.feature.toLowerCase()).join(' and ')}</b> contributed in the opposite direction. </> : ''}These are model contributions, not causes or medical advice.</p></div><div className="shap-foot"><Info size={14}/> {result.model === 'ensemble' ? 'Combined influences use median-perturbation comparisons across the three models (not SHAP values).' : 'Explanations describe this model, not cause or clinical importance.'}</div></> : <div className="empty-result"><div className="empty-graphic"><div><Sparkles size={24}/></div><span className="empty-line l1"/><span className="empty-line l2"/><span className="empty-line l3"/></div><strong>Your explanation will appear here</strong><p>Explore an example profile to see how the selected model responds to each input.</p><div className="empty-tags"><span>Local demo</span><span>SHAP values</span><span>Feature-level</span></div></div>}
          </div>
        </section>

        {result && result.probability >= HIGH_DEMO_SCORE_THRESHOLD && <section className="care-guidance" aria-live="polite">
          <div className="care-guidance-top"><span className="care-guidance-icon"><Stethoscope size={19}/></span><div><div className="eyebrow muted">REAL-WORLD CARE</div><h2>{result.probability >= VERY_HIGH_DEMO_SCORE_THRESHOLD ? 'Very high demo output' : 'Higher demo score'}</h2></div><span className="care-score-pill">{Math.round(result.probability * 100)}% demo output</span></div>
          <p className="care-guidance-copy">This score comes from synthetic, non-clinically validated data. It is <strong>not a real asthma risk assessment</strong> and cannot tell you whether you need care. If you have symptoms or concerns, speak with a qualified doctor or pulmonologist. Do not wait for this app if breathing difficulty is severe or rapidly worsening.</p>
          {result.probability >= VERY_HIGH_DEMO_SCORE_THRESHOLD && <div className="very-high-steps"><div className="very-high-title"><span><ClipboardList size={16}/></span><div><strong>General next steps to discuss with a clinician</strong><small>The 85% display trigger is not a validated clinical cutoff; this checklist is not personalized medical advice.</small></div></div><ul><li>Arrange a visit with a qualified doctor or pulmonologist if you have symptoms or concerns; bring your symptom and possible-trigger notes.</li><li>Ask whether an evaluation is appropriate and, if asthma is diagnosed, work with the clinician on a written asthma action plan.</li><li>Do not start, stop, or change medication based on this model output. Follow instructions from your healthcare professional.</li></ul><a href="https://www.cdc.gov/asthma/living-with/index.html" target="_blank" rel="noreferrer">Read about asthma action plans <ExternalLink size={13}/></a></div>}
          <div className="care-links"><button type="button" className="care-link appointment-link" onClick={exportAppointmentSummary}><span><FileText size={16}/></span><div><strong>Prepare clinician visit summary</strong><small>Download a PDF of your journal, peak-flow, and care notes</small></div><Download size={14}/></button><a className="care-link booking-link" href="https://ors.gov.in/" target="_blank" rel="noreferrer"><span><ClipboardList size={16}/></span><div><strong>Government OPD appointments · India</strong><small>Online registration at participating hospitals</small></div><ExternalLink size={14}/></a><a className="care-link emergency-link" href="tel:112"><span><ShieldCheck size={16}/></span><div><strong>Emergency support · India 112</strong><small>For urgent emergencies, contact local emergency services</small></div><ArrowRight size={14}/></a></div>
          <div className="care-guidance-foot"><Info size={13}/> Care links are optional resources. A low demo score also cannot rule out asthma or replace medical advice.</div>
        </section>}

        <section className="panel whatif-panel" id="whatif">
          <div className="whatif-heading"><div className="council-title"><span className="whatif-icon"><Zap size={19}/></span><div><div className="eyebrow muted">INTERACTIVE WHAT-IF LAB</div><h2>Change one input</h2><p>Compare two model outputs while holding the other example inputs steady.</p></div></div><span className="whatif-model"><Activity size={14}/>{MODEL_LABEL(model)}</span></div>
          <div className="whatif-controls"><label className="whatif-select-label">Choose a factor<select value={whatIfFeature} onChange={e => { setWhatIfFeature(e.target.value); setWhatIfValue(null); setWhatIfResult(null); setWhatIfError('') }}>{whatIfOptions.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label><label className="whatif-range-label"><span><b>{whatIfDefinition[1]}</b><strong>{whatIfFeature === 'bmi' ? Number(whatIfSelected).toFixed(1) : whatIfSelected}{whatIfFeature === 'age' ? ' years' : ''}</strong></span><input type="range" min={whatIfDefinition[2]} max={whatIfDefinition[3]} step={whatIfDefinition[4]} value={whatIfSelected} onChange={e => setWhatIfValue(Number(e.target.value))}/><small>Current example: {whatIfOriginal}{whatIfFeature === 'age' ? ' years' : ''}</small></label><button className="whatif-run" onClick={compareWhatIf} disabled={whatIfLoading || !apiUp}>{whatIfLoading ? <><span className="spinner council-spinner"/> Comparing…</> : <><Sparkles size={15}/> Compare outputs</>}</button></div>
          {whatIfError && <div className="error-box"><Info size={15}/>{whatIfError}</div>}
          {whatIfLoading && <div className="whatif-loading"><span className="council-loading-orbit"><Activity size={20}/></span><strong>Running both example profiles</strong><small>Same model, one adjusted input.</small></div>}
          {!whatIfLoading && whatIfResult && !whatIfIsCurrent && <div className="council-stale"><Info size={15}/> The profile, factor, or model changed. Compare again to refresh these outputs.</div>}
          {!whatIfLoading && whatIfIsCurrent && <div className="whatif-results"><div className="whatif-output"><span className="whatif-output-icon baseline"><ClipboardList size={16}/></span><div className="whatif-output-copy"><span>Current example</span><strong>{Math.round(whatIfResult.base.probability * 100)}<small>%</small></strong></div><div className="whatif-track"><span style={{ width: `${Math.max(4, whatIfResult.base.probability * 100)}%` }}/></div></div><div className="whatif-arrow"><ArrowRight size={17}/></div><div className="whatif-output"><span className="whatif-output-icon adjusted"><Sparkles size={16}/></span><div className="whatif-output-copy"><span>{whatIfResult.feature.replaceAll('_', ' ')} = {whatIfResult.testValue}</span><strong>{Math.round(whatIfResult.changed.probability * 100)}<small>%</small></strong></div><div className="whatif-track adjusted-track"><span style={{ width: `${Math.max(4, whatIfResult.changed.probability * 100)}%` }}/></div></div><div className="whatif-delta"><span>Difference between outputs</span><strong>{Math.round((whatIfResult.changed.probability - whatIfResult.base.probability) * 100) > 0 ? '+' : ''}{Math.round((whatIfResult.changed.probability - whatIfResult.base.probability) * 100)}<small> points</small></strong></div></div>}
          {!whatIfLoading && !whatIfResult && <div className="whatif-empty"><span className="whatif-empty-icon"><Activity size={17}/></span><span>Move the slider, then compare the two illustrative outputs.</span></div>}
          <div className="whatif-disclaimer"><Info size={14}/> These are synthetic model outputs. Changing an input here does not establish cause, prevention, or a real-world risk change.</div>
        </section>

        <section className="panel council-panel" id="council">
          <div className="council-heading"><div className="council-title"><span className="council-icon"><BarChart3 size={19}/></span><div><div className="eyebrow muted">INTERACTIVE MODEL LAB</div><h2>Model Council</h2><p>Run the same example through every available model and compare their outputs.</p></div></div><button className="council-run" onClick={runModelCouncil} disabled={councilLoading || !apiUp}>{councilLoading ? <><span className="spinner council-spinner"/> Comparing…</> : <><Sparkles size={15}/> Compare this profile</>}</button></div>
          {councilError && <div className="error-box"><Info size={15}/>{councilError}</div>}
          {councilLoading && <div className="council-loading"><div className="council-loading-orbit"><Activity size={21}/></div><strong>Checking each model with the same profile</strong><span>This can take a moment while models load.</span></div>}
          {!councilLoading && !council.length && <div className="council-empty"><div className="council-empty-icon"><BarChart3 size={20}/></div><div><strong>See where the models agree—and differ</strong><span>Compare their synthetic outputs and top explanation features for the current example profile.</span></div><ArrowRight size={17}/></div>}
          {!councilLoading && council.length > 0 && !councilIsCurrent && <div className="council-stale"><Info size={15}/> Inputs changed since this comparison. Run it again to compare the current profile.</div>}
          {!councilLoading && councilIsCurrent && <>
            <div className="council-summary"><div className="council-summary-icon"><Activity size={17}/></div><div><strong>{council.length} model{council.length === 1 ? '' : 's'} compared</strong><span>All received the same example inputs.</span></div><div className="spread-stat"><strong>{councilSpread}<small> pts</small></strong><span>output spread</span></div></div>
            <div className="council-grid">{council.map(output => <article className="council-model-card" key={output.model}><div className="council-model-top"><span className={`model-dot ${output.model}`}/><strong>{MODEL_LABEL(output.model)}</strong><span className="council-model-tag">demo</span></div><div className="council-model-method">{MODEL_METHOD(output.model)}</div><div className="council-score"><strong>{Math.round(output.probability * 100)}<small>%</small></strong><span>illustrative output</span></div><div className="council-track"><span style={{ width: `${Math.max(5, output.probability * 100)}%` }}/></div><div className="council-metric"><span>Held-out AUC</span><b>{output.metrics?.auc?.toFixed(3) ?? '—'}</b></div></article>)}</div>
            <div className="council-interpretation"><div className="council-interpretation-title"><span><Info size={15}/></span><div><strong>Why can the percentages differ?</strong><small>Each model is a different mathematical method.</small></div></div><p>For this same example, the demo outputs are <b>{council.map(output => `${MODEL_LABEL(output.model)} ${Math.round(output.probability * 100)}%`).join(', ')}.</b> Logistic Regression combines inputs using a linear formula; Random Forest averages many decision trees; XGBoost builds trees in sequence to improve earlier predictions. Those different learned patterns can produce different scores even when the inputs are identical.</p><div className="council-example"><Sparkles size={14}/><span>If Random Forest says <b>36%</b> and Logistic Regression or XGBoost show other percentages, that means the demo models respond differently to the same profile. It does <strong>not</strong> mean there is a real 36% chance of asthma, nor does one result confirm or overrule another.</span></div></div>
            <div className="council-features"><div><div className="eyebrow muted">FEATURES THAT SHOW UP MOST</div><span>Counted across each model’s top three explanation values</span></div><div className="council-chips">{councilFeatures.map(([feature, count]) => <span key={feature}><Check size={12}/>{feature}<b>{count}/{council.length}</b></span>)}</div></div>
            <div className="council-disclaimer"><Info size={14}/> Output spread and explanation overlap are only comparisons between synthetic demo models—not a confidence measure or medical risk.</div>
          </>}
        </section>

        <section className="panel sweep-panel" id="model-map">
          <div className="sweep-heading"><div className="council-title"><span className="sweep-icon"><Activity size={19}/></span><div><div className="eyebrow muted">MODEL DISAGREEMENT MAP</div><h2>Watch all models respond</h2><p>Sweep one input across a range while keeping the other example values fixed.</p></div></div><label className="sweep-select">Change<select value={sweepFeature} onChange={e => { setSweepFeature(e.target.value); setSweepResult(null); setSweepError('') }}><option value="allergy">Known allergies</option><option value="wheezing">Recent wheezing</option><option value="exercise_trigger">Exercise trigger</option><option value="air_quality">Air quality exposure</option><option value="respiratory_infections">Respiratory infections</option><option value="age">Age</option><option value="bmi">Body mass index</option><option value="smoking">Current smoker</option></select></label></div>
          <div className="sweep-controls"><span><Info size={14}/> Based on your current example profile</span><button className="sweep-run" onClick={runModelSweep} disabled={!apiUp || sweepLoading}>{sweepLoading ? <><span className="spinner sweep-spinner"/> Mapping…</> : <><Activity size={15}/> Generate model map</>}</button></div>
          {sweepError && <div className="error-box"><Info size={15}/>{sweepError}</div>}
          {sweepLoading && <div className="sweep-empty">Generating a synthetic comparison across the selected input…</div>}
          {!sweepLoading && sweepResult && !sweepIsCurrent && <div className="council-stale"><Info size={15}/> Your profile or selected factor changed. Generate the map again to refresh.</div>}
          {!sweepLoading && sweepIsCurrent && <div className="sweep-chart-wrap"><div className="sweep-legend">{sweepResult.models.map(series => <span key={series.model}><i className={`model-dot ${series.model}`}/>{MODEL_LABEL(series.model)}</span>)}</div><div className="sweep-chart-scroll"><svg className="sweep-chart" viewBox="0 0 600 220" role="img" aria-label={`Synthetic model output map for ${sweepFeature.replaceAll('_', ' ')}`}><text x="5" y="24">100%</text><text x="12" y="87">50%</text><text x="20" y="150">0%</text>{[25,87,150].map(y => <line key={y} x1="42" x2="574" y1={y} y2={y} className="sweep-gridline"/>)}{sweepResult.models.map(series => { const pts = series.points || []; const path = pts.map((point, index) => `${index ? 'L' : 'M'} ${48 + index * (510 / Math.max(1, pts.length - 1))} ${150 - point.probability * 125}`).join(' '); return <g key={series.model}><path d={path} className={`sweep-line ${series.model}`}/>{pts.map((point, index) => <g key={`${series.model}-${point.value}`}><circle cx={48 + index * (510 / Math.max(1, pts.length - 1))} cy={150 - point.probability * 125} r="4" className={`sweep-point ${series.model}`}/><text x={48 + index * (510 / Math.max(1, pts.length - 1))} y="177" textAnchor="middle">{point.value}</text></g>)}</g>})}<text x="48" y="205">{fields.find(([key]) => key === sweepFeature)?.[1] || sweepFeature}</text></svg></div><p className="sweep-caption">Each line is a different model’s output. Divergence shows model behavior on this synthetic example, not certainty, cause, or a personal risk estimate.</p></div>}
          {!sweepLoading && !sweepResult && <div className="sweep-empty"><span className="sweep-empty-icon"><Activity size={17}/></span>Pick an input and generate a map to compare all available models.</div>}
        </section>

        <section className="panel peak-flow-diary" id="peak-flow-diary">
          <div className="peak-flow-heading"><div className="peak-flow-title"><span className="peak-flow-icon"><Wind size={19}/></span><div><div className="eyebrow muted">PERSONAL ASTHMA MONITORING</div><h2>Peak Flow Diary</h2><p>Keep a dated record of readings from your peak-flow meter.</p></div></div><span className="peak-flow-count"><Activity size={13}/>{peakFlowEntries.length} / 30 saved</span></div>
          <div className="peak-flow-note"><Info size={14}/><span>This diary stores and displays readings only. It does not interpret results or set asthma action-plan zones. Follow your clinician-created plan and ask them how and when to measure.</span></div>
          <form className="peak-flow-form" onSubmit={addPeakFlowEntry}>
            <label>Peak flow reading <span>(L/min)</span><input type="number" min="1" step="1" inputMode="numeric" placeholder="e.g. 420" value={peakFlowReading} onChange={event => setPeakFlowReading(event.target.value)} required/></label>
            <label>Date and time measured<input type="datetime-local" value={peakFlowTime} onChange={event => setPeakFlowTime(event.target.value)} required/></label>
            <button type="submit"><Save size={14}/> Save reading</button>
          </form>
          {peakFlowError && <div className="peak-flow-error" role="alert"><Info size={14}/>{peakFlowError}</div>}
          {peakFlowEntries.length ? <>
            <div className="peak-flow-chart" role="img" aria-label="Recent peak-flow readings displayed as a simple history chart, with no interpretation">
              {peakFlowEntries.slice(0, 7).reverse().map(entry => <div className="peak-flow-bar-item" key={entry.id}><strong>{entry.value}</strong><div className="peak-flow-bar-track"><span style={{ height: `${Math.max(8, (Number(entry.value) / Math.max(...peakFlowEntries.slice(0, 7).map(item => Number(item.value)))) * 100)}%` }}/></div><time>{new Date(entry.recorded_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</time></div>)}
            </div>
            <div className="peak-flow-list" aria-label="Recent peak-flow records"><div className="peak-flow-list-heading">Recent readings <small>Newest first</small></div>{peakFlowEntries.slice(0, 7).map(entry => <div className="peak-flow-row" key={`row-${entry.id}`}><span className="peak-flow-row-icon"><Wind size={14}/></span><strong>{entry.value} <small>L/min</small></strong><time>{new Date(entry.recorded_at).toLocaleString()}</time><button type="button" aria-label={`Delete reading of ${entry.value} litres per minute`} onClick={() => removePeakFlowEntry(entry.id)}><Trash2 size={14}/></button></div>)}</div>
          </> : <div className="peak-flow-empty"><span><Activity size={18}/></span><strong>No readings saved yet</strong><small>Record a reading to start your personal history.</small></div>}
          <div className="peak-flow-resource"><Leaf size={14}/><span>Learn about using a peak-flow meter as part of an asthma action plan in the <a href="https://www.nhlbi.nih.gov/health/asthma/living-with" target="_blank" rel="noreferrer">NHLBI asthma guide</a>.</span></div>
        </section>

        {result && <div className="export-row"><div><span className="export-icon"><BadgeInfo size={17}/></span><div><strong>Take this explanation with you</strong><small>Download a local JSON summary of this synthetic demo output.</small></div></div><button onClick={exportResult}><FileDown size={16}/> Export explanation</button></div>}

        <section className="records-grid" id="journal">
          <div className="panel journal-panel"><div className="panel-heading"><div><div className="eyebrow muted">PRIVATE TO YOUR ACCOUNT</div><h2>Symptom & trigger journal</h2><p>Keep a simple record for your own reference.</p></div><div className="form-icon"><ClipboardList size={19}/></div></div><form className="journal-form" onSubmit={saveJournalEntry}><label>Symptom<select value={journalDraft.symptom} onChange={e => setJournalDraft({ ...journalDraft, symptom: e.target.value })}>{['No symptoms','Cough','Wheezing','Shortness of breath','Chest tightness'].map(item => <option key={item}>{item}</option>)}</select></label><label>Severity<select value={journalDraft.severity} onChange={e => setJournalDraft({ ...journalDraft, severity: Number(e.target.value) })}><option value={0}>None</option><option value={1}>Mild</option><option value={2}>Moderate</option><option value={3}>High</option></select></label><label>Possible trigger<select value={journalDraft.possible_trigger} onChange={e => setJournalDraft({ ...journalDraft, possible_trigger: e.target.value })}>{['None noted','Pollen','Dust','Smoke','Cold air','Exercise','Respiratory illness','Other'].map(item => <option key={item}>{item}</option>)}</select></label><label>Night waking<select value={journalDraft.night_waking} onChange={event => setJournalDraft({ ...journalDraft, night_waking: event.target.value })}><option>Not recorded</option><option>Yes</option><option>No</option></select></label>{airQualityContext && <label className="air-attach-option"><input type="checkbox" checked={includeAirQualityContext} onChange={event => setIncludeAirQualityContext(event.target.checked)}/><span>Attach latest air lookup: {airQualityContext.location} (US AQI {airQualityContext.us_aqi ?? "n/a"})</span></label>}<label className="journal-notes">Notes <span>(optional)</span><textarea maxLength={300} rows={2} placeholder="A short note for your own reference" value={journalDraft.notes} onChange={e => setJournalDraft({ ...journalDraft, notes: e.target.value })}/></label>{journalError && <div className="auth-error"><Info size={15}/>{journalError}</div>}<button className="journal-submit"><Check size={15}/> Save journal entry</button><div className="journal-privacy"><ShieldCheck size={14}/> Saved to your account. This journal does not provide medical guidance.</div></form></div>
          <div className="panel history-panel" id="history"><div className="panel-heading"><div><div className="eyebrow muted">YOUR WORKSPACE</div><h2>Recent explorations</h2><p>Predictions saved to this account.</p></div><div className="form-icon"><Activity size={19}/></div></div>{history.length ? <div className="history-list">{history.slice(0, 6).map((item, i) => <div className="history-item" key={`${item.created_at}-${i}`}><span className="history-indicator"><Activity size={15}/></span><div className="history-main"><strong>{MODEL_LABEL(item.model)}</strong><span>{item.created_at ? new Date(item.created_at).toLocaleString() : 'Just now'}</span></div><b>{Math.round(item.probability * 100)}<small>%</small></b></div>)}</div> : <div className="history-empty"><div><Activity size={19}/></div><strong>No explorations yet</strong><span>Your saved demo outputs will appear here.</span></div>}<div className="journal-privacy history-note"><Info size={14}/> Outputs are synthetic examples, not medical risk estimates.</div></div>
        </section>

        <SymptomTrendCalendar journal={journal} peakFlowEntries={peakFlowEntries} language={language}/>

                <section className="journal-timeline panel" aria-label="Symptom and exposure timeline">
          <div className="timeline-heading"><div><div className="eyebrow muted">YOUR RECENT NOTES</div><h2>Symptom & exposure timeline</h2><p>View your journal notes, optional air-quality context, and peak-flow readings together.</p></div><span className="timeline-count">{timelineItems.length} recent</span></div>
          {timelineItems.length ? <div className="timeline-list">{timelineItems.map(item => item.kind === 'journal' ? <article className="timeline-entry" key={item.id}><span className={`timeline-dot severity-${Number(item.entry.severity) || 0}`}><HeartPulse size={14}/></span><div className="timeline-entry-main"><div className="timeline-entry-top"><strong>{item.entry.symptom || 'Journal note'}</strong><time>{item.recordedAt ? new Date(item.recordedAt).toLocaleString() : 'Recently recorded'}</time></div><div className="timeline-meta"><span>Severity: {['None', 'Mild', 'Moderate', 'High'][Number(item.entry.severity)] || 'Not recorded'}</span><span>Possible trigger noted: {item.entry.possible_trigger || 'Not noted'}</span><span>Night waking: {item.entry.night_waking || 'Not recorded'}</span></div>{item.entry.air_quality_context && <div className="timeline-exposure"><Wind size={13}/><span>Air lookup near {item.entry.air_quality_context.location || 'selected location'}: US AQI {item.entry.air_quality_context.us_aqi ?? 'not available'}; PM2.5 {item.entry.air_quality_context.pm2_5 ?? 'not available'}; PM10 {item.entry.air_quality_context.pm10 ?? 'not available'}.</span></div>}{item.entry.notes && <p>{item.entry.notes}</p>}</div></article> : <article className="timeline-entry peak-flow-timeline-entry" key={item.id}><span className="timeline-dot"><Wind size={14}/></span><div className="timeline-entry-main"><div className="timeline-entry-top"><strong>Peak-flow reading: {item.entry.value} L/min</strong><time>{item.recordedAt ? new Date(item.recordedAt).toLocaleString() : 'Recently recorded'}</time></div><div className="timeline-meta"><span>Personal meter entry</span></div></div></article>)}</div> : <div className="care-empty"><ClipboardList size={16}/> Journal and peak-flow entries will appear here.</div>}
          <div className="timeline-disclaimer"><Info size={13}/> These are user-recorded observations. Seeing items together does not show that one caused another or provide a clinical trend analysis.</div>
        </section>

        <section className="whatif-insights" aria-label="Journal insights"><div className="whatif-insights-head"><span className="insights-icon purple"><ClipboardList size={17}/></span><div><div className="eyebrow muted">YOUR JOURNAL AT A GLANCE</div><h2>Personal pattern summary</h2></div></div><div className="insights-grid"><article><span className="insights-icon teal"><Activity size={16}/></span><div><small>Entries recorded</small><strong>{journalInsights.count}</strong></div><span className="insights-note">{journalInsights.count ? 'in this session / account' : 'Add an entry to begin'}</span></article><article><span className="insights-icon coral"><HeartPulse size={16}/></span><div><small>Most logged symptom</small><strong>{journalInsights.symptom?.[0] || 'No pattern yet'}</strong></div><span className="insights-note">{journalInsights.symptom ? `${journalInsights.symptom[1]} ${journalInsights.symptom[1] === 1 ? 'entry' : 'entries'}` : 'Based on your journal entries'}</span></article><article><span className="insights-icon amber"><Wind size={16}/></span><div><small>Most noted possible trigger</small><strong>{journalInsights.trigger?.[0] || 'No pattern yet'}</strong></div><span className="insights-note">{journalInsights.trigger ? `${journalInsights.trigger[1]} ${journalInsights.trigger[1] === 1 ? 'entry' : 'entries'}` : 'Based on your journal entries'}</span></article></div><div className="insights-foot"><Info size={13}/> Simple counts from journal labels only; they do not detect medical patterns or recommend prevention.</div></section>

        <section className="panel comparison-panel"><div className="compare-head"><div><div className="eyebrow muted">MODEL BENCHMARK</div><h2>Compare approaches</h2><p>Metrics from a held-out synthetic test split.</p></div><span className="benchmark-tag"><Activity size={14}/> Engineering demo</span></div><div className="table-wrap"><table><thead><tr><th>MODEL</th><th>ACCURACY</th><th>ROC AUC</th><th>F1 SCORE</th><th>TYPE</th></tr></thead><tbody>{[['random_forest','Bagged trees'],['logistic_regression','Linear model'],['xgboost','Boosted trees']].map(([id,type]) => { const m=models.find(x=>x.id===id); return <tr key={id}><td><span className="table-model"><i className={`model-dot ${id}`}/><span>{MODEL_LABEL(id)}<small>{MODEL_METHOD(id)}</small></span></span></td><td>{m ? `${Math.round(m.accuracy*100)}%` : '—'}</td><td>{m ? m.auc.toFixed(3) : '—'}</td><td>{m ? m.f1.toFixed(3) : '—'}</td><td><span className="type-pill">{type}</span></td></tr> })}</tbody></table></div><div className="metrics-caption"><Info size={14}/> Metrics reflect a synthetic target and do not indicate real-world or clinical performance.</div></section>

        <section className="panel trust-lab" id="data-trust">
          <div className="trust-heading"><div className="council-title"><span className="trust-icon"><Database size={19}/></span><div><div className="eyebrow muted">SYNTHETIC DATA DETECTIVE</div><h2>Data Trust Lab</h2><p>Explore how this demo dataset is distributed and how model metrics vary across example slices.</p></div></div><span className="synthetic-pill">SYNTHETIC ONLY</span></div>
          {trustError && <div className="error-box"><Info size={15}/>{trustError}</div>}
          {trustLoading && <div className="trust-loading"><span className="council-loading-orbit"><Database size={18}/></span>Loading the synthetic dataset summary…</div>}
          {!trustLoading && trustData && <>
            <div className="trust-summary-grid"><article><span className="trust-stat-icon teal"><Database size={15}/></span><div><small>Generated rows</small><strong>{trustData.row_count.toLocaleString()}</strong></div></article><article><span className="trust-stat-icon coral"><Activity size={15}/></span><div><small>Synthetic label: 1</small><strong>{trustData.class_balance.positive.toLocaleString()}</strong></div></article><article><span className="trust-stat-icon blue"><Activity size={15}/></span><div><small>Synthetic label: 0</small><strong>{trustData.class_balance.negative.toLocaleString()}</strong></div></article></div>
            <div className="trust-explorer"><div className="trust-subhead"><div><div className="eyebrow muted">DISTRIBUTION EXPLORER</div><h3>Filter the generated examples</h3></div><label>Feature<select value={trustFeature} onChange={e => { setTrustFeature(e.target.value); setTrustBin(null) }}>{trustFeatureOptions.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label></div>
              <div className="trust-bars">{trustDistribution.map(bin => { const maxCount = Math.max(1, ...trustDistribution.map(item => item.count)); return <button key={bin.label} className={`trust-bar-row ${trustBin === bin.label ? 'selected' : ''}`} onClick={() => setTrustBin(trustBin === bin.label ? null : bin.label)}><span className="trust-bar-label">{bin.label}</span><span className="trust-bar-track"><i style={{ width: `${Math.max(2, (bin.count / maxCount) * 100)}%` }}/></span><b>{bin.count}</b></button> })}</div>
              <div className="trust-selection"><span className="trust-selection-icon"><Info size={14}/></span>{selectedTrustBin ? <span><strong>{selectedTrustBin.label}</strong> contains {selectedTrustBin.count} rows; {Math.round(selectedTrustBin.positiveRate * 100)}% have the synthetic label 1.</span> : <span>Select a bar to inspect its count and synthetic label share.</span>}</div>
            </div>
            <div className="trust-correlation"><div className="eyebrow muted">STRONGEST CORRELATIONS IN THIS GENERATED FILE</div><div>{trustData.correlations.slice(0, 6).map(pair => <span key={`${pair.left}-${pair.right}`}>{pair.left.replaceAll('_', ' ')} · {pair.right.replaceAll('_', ' ')} <b>{pair.value > 0 ? '+' : ''}{pair.value}</b></span>)}</div><small>Correlation is descriptive and does not show cause. These patterns are shaped by the synthetic data generator.</small></div>
            <div className="fairness-lens"><div className="trust-subhead"><div><div className="eyebrow muted">FAIRNESS LENS · HELD-OUT SYNTHETIC SPLIT</div><h3>Compare example subgroup metrics</h3></div><label>Slice<select value={trustSlice} onChange={e => setTrustSlice(e.target.value)}><option value="age_group">Age band</option><option value="smoking">Smoking example</option><option value="allergy">Allergy example</option></select></label></div>
              <div className="fairness-groups">{[...new Set(trustSliceRows.map(item => item.group))].map(group => { const item = trustSliceRows.find(row => row.group === group); return <article className="fairness-group" key={group}><div className="fairness-group-head"><strong>{group}</strong><span>n = {item?.n ?? 0}</span></div><div className="table-wrap"><table><thead><tr><th>MODEL</th><th>ACCURACY</th><th>RECALL</th></tr></thead><tbody>{models.map(available => { const valuesForModel = item?.models?.[available.id]; return <tr key={available.id}><td><span className="fairness-model-name">{MODEL_LABEL(available.id)}<small>{MODEL_METHOD(available.id)}</small></span></td><td>{valuesForModel ? `${Math.round(valuesForModel.accuracy * 100)}%` : '—'}</td><td>{valuesForModel ? `${Math.round(valuesForModel.recall * 100)}%` : '—'}</td></tr> })}</tbody></table></div></article> })}</div>
              <div className="trust-note"><ShieldCheck size={14}/> These slices are examples, not a fairness certification. Only age, smoking, and allergy are represented here; the data and metrics are synthetic and small samples can be unstable.</div>
            </div>
          </>}
          <div className="trust-footer"><Info size={14}/> No patient records are included. The target label and all metrics come from generated data and have no clinical meaning.</div>
        </section>

        <AirQualityWidget onReportChange={setAirQualityContext} language={language}/>

        <section className="inhaler-learning panel" id="inhaler-learning">
          <div className="inhaler-learning-heading"><div className="inhaler-learning-title"><span className="inhaler-learning-icon"><Wind size={19}/></span><div><div className="eyebrow muted">DEVICE EDUCATION</div><h2>Inhaler learning center</h2><p>Find trusted demonstrations for common device types.</p></div></div><span className="inhaler-learning-tag"><BookOpen size={13}/> External learning resources</span></div>
          <div className="inhaler-resource-grid">
            <article className="inhaler-resource-card"><span className="inhaler-resource-icon mint"><Wind size={17}/></span><div><h3>Metered-dose inhaler + spacer</h3><p>CDC demonstration video and printed instructions for this device setup.</p><a href="https://www.cdc.gov/asthma/caring/" target="_blank" rel="noreferrer">Open CDC inhaler guide <ExternalLink size={13}/></a></div></article>
            <article className="inhaler-resource-card"><span className="inhaler-resource-icon blue"><Activity size={17}/></span><div><h3>Metered-dose inhaler</h3><p>Review the CDC demonstration for an inhaler used without a spacer.</p><a href="https://www.cdc.gov/asthma/caring/" target="_blank" rel="noreferrer">Choose the no-spacer video <ExternalLink size={13}/></a></div></article>
            <article className="inhaler-resource-card"><span className="inhaler-resource-icon violet"><BookOpen size={17}/></span><div><h3>Dry-powder and other devices</h3><p>Browse technique videos by inhaler type and select the exact device you use.</p><a href="https://www.asthmaandlung.org.uk/living-with/inhaler-videos" target="_blank" rel="noreferrer">Browse device video library <ExternalLink size={13}/></a></div></article>
            <article className="inhaler-resource-card"><span className="inhaler-resource-icon coral"><FileText size={17}/></span><div><h3>Printable MDI instructions</h3><p>NHLBI patient handout for metered-dose inhalers and spacers.</p><a href="https://www.nhlbi.nih.gov/sites/default/files/publications/How-to-Use-a-Metered-Dose-Inhaler_21-HL-8165.pdf" target="_blank" rel="noreferrer">Open NHLBI handout <ExternalLink size={13}/></a></div></article>
          </div>
          <div className="inhaler-learning-note"><ShieldCheck size={14}/><span>Technique depends on the exact device. Ask a clinician or pharmacist to watch you use yours and explain its instructions. These resources are educational and don’t recommend a medicine or dose.</span></div>
        </section>

        <section className="care-toolkit" id="care-toolkit">
          <div className="care-toolkit-heading"><span className="care-toolkit-icon"><HeartPulse size={19}/></span><div><div className="eyebrow muted">PERSONAL ORGANIZATION TOOLS</div><h2>Asthma care toolkit</h2><p>Keep clinician-provided information and your own reminders together.</p></div><div className="personal-storage-control">{user.is_guest ? <span className="care-toolkit-badge"><ShieldCheck size={13}/> Guest session</span> : <><label className="remember-toggle"><input type="checkbox" checked={rememberOnDevice} onChange={event => toggleRememberOnDevice(event.target.checked)}/><span>{rememberOnDevice ? 'Saved on this browser' : 'Remember my records on this browser'}</span></label><small>Stored only on this device. Avoid shared computers.</small></>}{rememberError && <small className="remember-error">{rememberError}</small>}</div></div>
          <div className="care-toolkit-grid">
            <article className="care-tool-card plan-card">
              <div className="care-card-title"><span className="care-card-icon violet"><ClipboardList size={17}/></span><div><h3>Action-plan wallet</h3><p>Enter details from a plan created with your clinician.</p></div></div>
              <div className="plan-note"><Info size={13}/> BreatheWise does not create or fill in treatment instructions.</div>
              <label>Clinician or clinic (optional)<input value={carePlan.clinician} maxLength={100} onChange={e => setCarePlan({ ...carePlan, clinician: e.target.value })} placeholder="Name or clinic"/></label>
              <div className="plan-zones"><label><span className="zone-dot green"/> Green zone · my clinician's notes<textarea rows={2} maxLength={400} value={carePlan.green} onChange={e => setCarePlan({ ...carePlan, green: e.target.value })} placeholder="Copy your own plan notes"/></label><label><span className="zone-dot yellow"/> Yellow zone · my clinician's notes<textarea rows={2} maxLength={400} value={carePlan.yellow} onChange={e => setCarePlan({ ...carePlan, yellow: e.target.value })} placeholder="Copy your own plan notes"/></label><label><span className="zone-dot red"/> Red zone · my clinician's notes<textarea rows={2} maxLength={400} value={carePlan.red} onChange={e => setCarePlan({ ...carePlan, red: e.target.value })} placeholder="Copy your own plan notes"/></label></div>
              <label>Emergency contact (optional)<input value={carePlan.emergency} maxLength={120} onChange={e => setCarePlan({ ...carePlan, emergency: e.target.value })} placeholder="Name and phone number"/></label>
              <button className="care-tool-button" onClick={() => saveCareTools()}><Save size={14}/>{careSaved ? 'Saved for this session' : 'Save my plan notes'}</button>
            </article>

            <article className="care-tool-card reminders-card">
              <div className="care-card-title"><span className="care-card-icon coral"><Bell size={17}/></span><div><h3>Medicine reminders</h3><p>Set a reminder label and time from your existing instructions.</p></div></div>
              <div className="reminder-notification-control">{notificationPermission === 'default' ? <button type="button" className="care-tool-button" onClick={enableReminderNotifications}><Bell size={14}/> Enable browser notifications</button> : <span>{notificationPermission === 'granted' ? 'Browser notifications are enabled.' : notificationPermission === 'denied' ? 'Browser notifications are blocked. Allow them in your browser site settings.' : 'Browser notifications are unavailable in this browser.'}</span>}</div>
              <form className="med-reminder-form" onSubmit={addMedicationReminder}><label>Reminder label<input value={medDraft.name} maxLength={80} onChange={e => setMedDraft({ ...medDraft, name: e.target.value })} placeholder="e.g., Morning medicine" required/></label><label>Time<input type="time" value={medDraft.time} onChange={e => setMedDraft({ ...medDraft, time: e.target.value })} required/></label><button className="care-tool-button"><Bell size={14}/> Add reminder</button></form>
              {medications.length ? <ul className="med-reminder-list">{[...medications].sort((a, b) => a.time.localeCompare(b.time)).map(item => <li key={item.id}><span className="med-time"><Pill size={13}/>{item.time}</span><strong>{item.name}</strong><button type="button" className="med-calendar-button" aria-label={`Add ${item.name} to Google Calendar`} title="Add to Google Calendar" onClick={() => openGoogleCalendarReminder(item)}><CalendarDays size={13}/><span>Google Calendar</span></button><button type="button" aria-label={`Remove ${item.name} reminder`} title="Remove reminder" onClick={() => removeMedicationReminder(item.id)}><Trash2 size={14}/></button></li>)}</ul> : <div className="care-empty"><Bell size={16}/> No reminders added yet.</div>}
              <div className="plan-note"><Info size={13}/> Choose Google Calendar beside each reminder. Review it and tap Save in Google Calendar. Its daily alert can work while this website is closed. Browser alerts need permission. These reminders do not suggest medicines or doses.</div>
            </article>

            <article className="care-tool-card appointment-card">
              <div className="care-card-title"><span className="care-card-icon blue"><CalendarDays size={17}/></span><div><h3>Appointment prep</h3><p>Export your journal, peak-flow readings, and optional plan notes for a clinician visit.</p></div></div>
              <div className="appointment-preview"><div><ClipboardList size={15}/><span><strong>{journal.length} journal {journal.length === 1 ? 'entry' : 'entries'}</strong><small>Journal, optional air context, and peak-flow readings</small></span></div><div><BookOpen size={15}/><span><strong>Discussion prompts</strong><small>Questions to bring to your clinician</small></span></div></div>
              <button className="care-tool-button" onClick={exportAppointmentSummary}><FileText size={14}/> Generate health summary PDF</button>
              <div className="plan-note"><ShieldCheck size={13}/> PDF created on this device with journal, peak-flow, and your entered plan notes. Review it before sharing.</div>
            </article>

            <article className="care-tool-card trigger-card">
              <div className="care-card-title"><span className="care-card-icon mint"><Wind size={17}/></span><div><h3>Trigger detective</h3><p>Review what you have logged most often.</p></div></div>
              {journalInsights.trigger ? <div className="trigger-insight"><span className="trigger-count">{journalInsights.trigger[1]}</span><div><strong>{journalInsights.trigger[0]} is your most logged possible trigger</strong><small>Across {journal.length} journal {journal.length === 1 ? 'entry' : 'entries'}; this is a logging summary, not evidence of cause.</small></div></div> : <div className="care-empty"><Wind size={16}/> Add possible triggers to your journal to see a summary.</div>}
              <div className="trigger-tags">{journalInsights.triggerList?.map(([trigger, count]) => <span key={trigger}>{trigger}<b>{count}</b></span>)}</div>
              <div className="plan-note"><Info size={13}/> Discuss suspected triggers with a healthcare professional before making major changes.</div>
            </article>
          </div>
        </section>

        <section className="data-section" id="data"><div className="data-copy"><div className="eyebrow muted">DATA & RESPONSIBLE USE</div><h2>Built for exploration,<br/>with context included.</h2><p>This project includes a generated dataset to demonstrate the full machine learning workflow. No patient records are bundled. The sample labels are synthetic and do not represent real asthma outcomes.</p><a href="https://www.cdc.gov/asthma/data-analysis-guidance/brfss-core-asthma-questions.htm" target="_blank" rel="noreferrer">Explore CDC BRFSS asthma data <ExternalLink size={14}/></a></div><div className="data-card"><div className="data-card-top"><div className="dataset-icon"><Database size={19}/></div><span className="synthetic-pill">SYNTHETIC</span></div><h3>Asthma demo dataset</h3><p>Training set is generated on first API start; preview CSV is included below.</p><div className="dataset-stats"><div><strong>{overview?.dataset?.rows?.toLocaleString() || '1,200'}</strong><span>generated rows</span></div><div><strong>10</strong><span>input features</span></div><div><strong>20</strong><span>preview rows</span></div></div><div className="data-card-foot"><span><Check size={14}/> Included with project</span><a href="/asthma_synthetic.csv" download><Download size={15}/> Get preview CSV</a></div></div></section>
        <section className="prevention-strip"><div className="prevention-icon"><ShieldCheck size={19}/></div><div><strong>Prevention starts with trusted guidance</strong><p>For personal prevention steps and asthma management, use guidance from a qualified health professional and public health resources.</p></div><a href="https://www.cdc.gov/asthma/about/index.html" target="_blank" rel="noreferrer">CDC asthma information <ArrowRight size={15}/></a></section>
        <footer><div className="footer-brand"><Wind size={16}/> breathewise</div><span>Educational research prototype · Not a medical device</span><span>© 2026 BreatheWise demo</span></footer>
      </div>
    </main>
    <QuickCareCard open={careCardOpen} onClose={() => setCareCardOpen(false)} carePlan={carePlan} language={language}/>
    <HelpCenter open={helpOpen} onClose={() => setHelpOpen(false)} onAskGuide={() => { setHelpOpen(false); setChatOpenRequest(value => value + 1) }} language={language}/>
    <AsthmaChat onExportSummary={exportAppointmentSummary} datasetInfo={overview?.dataset} language={language} openRequest={chatOpenRequest} />
  </div></Localized>
}

function MODEL_LABEL(key) { return ({ ensemble: 'BreatheWise Model Ensemble', random_forest: 'Airway Pattern Forest', logistic_regression: 'Respiratory Linear Model', xgboost: 'Pulmonary Gradient Model' })[key] || key }
function MODEL_METHOD(key) { return ({ ensemble: 'Equal-weight average · Random Forest + Logistic Regression + XGBoost', random_forest: 'Random Forest', logistic_regression: 'Logistic Regression', xgboost: 'XGBoost' })[key] || key }

export default App
