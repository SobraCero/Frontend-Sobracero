const fs = require('fs');
let content = fs.readFileSync('src/views/Landing.vue', 'utf8');

// Replace navbar
content = content.replace(
  /<nav class="hidden md:flex gap-8 items-center text-sm font-bold text-stone-600">([\s\S]*?)<\/nav>/,
  `<nav class="hidden md:flex gap-8 items-center text-sm font-bold text-stone-600">
          <a href="#inicio" class="hover:text-emerald-600 transition-colors">Inicio</a>
          <a href="#ecosistema" class="hover:text-emerald-600 transition-colors">Ecosistema</a>
          <a href="#como-funciona" class="hover:text-emerald-600 transition-colors">¿Cómo funciona?</a>
          <a href="#impacto" class="hover:text-emerald-600 transition-colors">Impacto</a>
        </nav>`
);

// We know the exact sections in the file currently:
// 1. <!-- 2. ¿CÓMO FUNCIONA? --> to </section> (lines 66-106)
// 2. <!-- 3. IMPACTO SOCIAL --> to </section> (lines 108-183)
// 3. <!-- 4. ECOSISTEMA --> to </section> (lines 185-224)

const comoFuncionaRegex = /    <!-- 2\. ¿CÓMO FUNCIONA\? -->[\s\S]*?    <\/section>\n/;
const impactoRegex = /    <!-- 3\. IMPACTO SOCIAL -->[\s\S]*?    <\/section>\n/;
const ecosistemaRegex = /    <!-- 4\. ECOSISTEMA -->[\s\S]*?    <\/section>\n/;

const comoFuncionaMatch = content.match(comoFuncionaRegex);
const impactoMatch = content.match(impactoRegex);
const ecosistemaMatch = content.match(ecosistemaRegex);

if (comoFuncionaMatch && impactoMatch && ecosistemaMatch) {
  // Remove them all first
  let newContent = content
    .replace(comoFuncionaRegex, '')
    .replace(impactoRegex, '')
    .replace(ecosistemaRegex, '');
    
  // Now find the insertion point, which is right after HERO section's </section>
  const heroEndRegex = /    <\/section>\n\n/;
  
  const reorderedSections = `\n${ecosistemaMatch[0]}\n${comoFuncionaMatch[0]}\n${impactoMatch[0]}\n`;
  
  newContent = newContent.replace(heroEndRegex, `    </section>\n${reorderedSections}`);
  
  fs.writeFileSync('src/views/Landing.vue', newContent);
  console.log("Success");
} else {
  console.log("Could not find sections");
}
