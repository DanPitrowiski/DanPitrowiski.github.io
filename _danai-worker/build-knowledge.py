#!/usr/bin/env python3
"""Builds knowledge.md for DanAI from faq.md, the live pages and the resume.

Run from the repo root after changing faq.md, a page or the resume:
    python3 _danai-worker/build-knowledge.py
Reads the resume with pdftotext or pypdf (see resume_text). Then redeploy the worker.
"""
import html, os, re, subprocess, sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, '_danai-worker', 'knowledge.md')
RESUME = 'Daniel Pitrowiski - Senior Product Designer.pdf'

# key: the id DanAI cites in its SOURCES line (js/danai.js maps it to a link)
PAGES = [
    ('index', 'index.html', 'Homepage'),
    ('resume-wootric', 'resume-wootric.html', 'Case study: AI feedback analysis at Wootric (CXInsights)'),
    ('ai-auto-tagging', 'ai-auto-tagging.html', 'Case study: Building trust in AI auto-tagging'),
    ('resume-pg-forsta', 'resume-pg-forsta.html', 'Case study: Four projects at Press Ganey'),
    ('enthuse', 'enthuse.html', 'Case study: Enthuse'),
    ('article-great-designer-portfolio', 'article-great-designer-portfolio.html', 'Article: What Makes a Great Designer Portfolio?'),
    ('knight', 'knight.html', 'Side project: Knight of the Living Dead'),
]

BLOCK = {'p', 'li', 'h1', 'h2', 'h3', 'h4', 'dt', 'dd', 'figcaption', 'blockquote', 'tr', 'caption', 'cite', 'div', 'section'}
SKIP = {'script', 'style', 'nav', 'svg', 'video', 'button'}

class Text(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out, self.skip, self.in_main = [], 0, False
    def handle_starttag(self, tag, attrs):
        if tag == 'main': self.in_main = True
        if not self.in_main: return
        if tag in SKIP: self.skip += 1
        if self.skip: return
        if tag in BLOCK: self.out.append('\n')
        if tag in ('h1', 'h2'): self.out.append('## ')
        if tag in ('h3', 'h4'): self.out.append('### ')
        if tag == 'li': self.out.append('- ')
        if tag in ('td', 'th'): self.out.append(' | ')
        if tag == 'img':
            alt = dict(attrs).get('alt')
            if alt: self.out.append('[Image: %s]\n' % alt)
    def handle_endtag(self, tag):
        if tag == 'main': self.in_main = False
        if not self.in_main and tag != 'main': return
        if tag in SKIP and self.skip: self.skip -= 1; return
        if not self.skip and tag in BLOCK: self.out.append('\n')
    def handle_data(self, data):
        if self.in_main and not self.skip: self.out.append(data)

def page_text(path):
    src = open(path, encoding='utf-8').read()
    src = re.sub(r'<!--.*?-->', '', src, flags=re.S)  # hidden content stays hidden
    p = Text(); p.feed(src)
    text = ''.join(p.out)
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r' *\n *', '\n', text)
    text = re.sub(r'^- *\n+', '- ', text, flags=re.M)  # list items that wrap a <p>
    text = re.sub(r'(?m)^\| ', '', text)
    return re.sub(r'\n{3,}', '\n\n', text).strip()

def resume_text():
    # Reads the resume PDF with pdftotext if it's installed, otherwise with the pypdf
    # Python package (pip3 install --user pypdf). The text is saved to resume.txt,
    # which is used as a fallback when neither is available.
    cache = os.path.join(ROOT, '_danai-worker', 'resume.txt')
    pdf = os.path.join(ROOT, RESUME)
    txt = None
    try:
        txt = subprocess.run(['pdftotext', '-layout', pdf, '-'], capture_output=True, text=True, check=True).stdout
    except (OSError, subprocess.CalledProcessError):
        try:
            from pypdf import PdfReader
            txt = '\n'.join(page.extract_text() or '' for page in PdfReader(pdf).pages)
        except Exception:
            pass
    if txt:
        txt = re.sub(r'\+?1? ?\(?\d{3}\)?[ .-]?\d{3}[ .-]?\d{4}', '', txt)  # no phone number saved
        open(cache, 'w', encoding='utf-8').write(txt)
    elif os.path.exists(cache):
        print('Note: using the saved resume text in resume.txt. If the resume PDF changed, run: pip3 install --user pypdf')
        txt = open(cache, encoding='utf-8').read()
    else:
        sys.exit('Could not read the resume. Run: pip3 install --user pypdf')
    txt = re.sub(r'\+?1? ?\(?\d{3}\)?[ .-]?\d{3}[ .-]?\d{4}', '', txt)  # no phone number in the bot
    txt = txt.replace('​', '').replace('●', '-')
    txt = re.sub(r'[ \t]+', ' ', txt)
    txt = re.sub(r' \| \|', ' |', txt)
    return re.sub(r'\n{3,}', '\n\n', txt).strip()

def faq_text():
    """Reads faq.md: each "## " line is a question, the lines under it are the answer."""
    path = os.path.join(ROOT, '_danai-worker', 'faq.md')
    if not os.path.exists(path): return ''
    src = re.sub(r'<!--.*?-->', '', open(path, encoding='utf-8').read(), flags=re.S)
    items = []
    for block in re.split(r'(?m)^## +', src)[1:]:
        q, _, a = block.partition('\n')
        # Keep each line as written (paragraphs and "- " or "1. " list items)
        out = [l.strip() for l in a.strip().splitlines() if l.strip()]
        a = re.sub(r'\n{2,}', '\n', '\n'.join(out)).strip()
        if not a: sys.exit('faq.md: "%s" has no answer' % q.strip())
        items.append('FAQ %d\nQ: %s\nA: %s' % (len(items) + 1, q.strip(), a))
    return '\n\n'.join(items)

parts = ['# Knowledge about Daniel "Dan" Pitrowiski\n\nEverything below comes from Dan\'s portfolio site and resume. Each source starts with its SOURCE id.']
faq = faq_text()
if faq:
    parts.append("\n\n---\nSOURCE: faq\nTITLE: Dan's own answers to common questions\n\n%s" % faq)
for key, f, title in PAGES:
    parts.append('\n\n---\nSOURCE: %s\nTITLE: %s\n\n%s' % (key, title, page_text(os.path.join(ROOT, f))))
parts.append('\n\n---\nSOURCE: resume\nTITLE: Resume (PDF)\n\n%s' % resume_text())
open(OUT, 'w', encoding='utf-8').write(''.join(parts) + '\n')
print('Wrote %s (%d characters)' % (OUT, len(''.join(parts))))
