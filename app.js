// Each screen uses the same form values. Only the visible inputs are validated.
const byId = (id) => document.getElementById(id);
const form = byId('wizard');
const screens = [...document.querySelectorAll('[data-step]')];
const labels = ['Token details', 'Launch rules', 'Review', 'Simulation'];
const number = new Intl.NumberFormat('en', { maximumFractionDigits: 2 });
let step = 0;

function showStep(next, focus = true) {
  step = next;
  screens.forEach((screen, index) => {
    screen.hidden = index !== step;
    screen.querySelectorAll('input').forEach((input) => {
      input.disabled = index !== step;
    });
  });
  byId('progress').textContent = `Step ${step + 1} of 4 · ${labels[step]}`;
  byId('copy-status').textContent = '';
  byId('manual').hidden = true;
  if (focus) screens[step].querySelector('h2').focus();
}

function readSetup() {
  return {
    name: byId('name').value.trim(),
    symbol: byId('symbol').value.toUpperCase(),
    supply: byId('supply').valueAsNumber,
    allocation: byId('allocation').valueAsNumber,
    price: byId('price').valueAsNumber,
    demand: byId('demand').valueAsNumber,
  };
}

function reviewText(setup) {
  return [
    'Launch Rehearsal · Simulation only',
    `Token: ${setup.name} (${setup.symbol})`,
    `Total supply: ${number.format(setup.supply)}`,
    `Offered for sale: ${number.format(setup.allocation)}`,
    `Mock credits per token: ${number.format(setup.price)}`,
    `Simulated demand: ${number.format(setup.demand)} tokens`,
  ].join('\n');
}

function simulate({ allocation, price, demand }) {
  const sold = Math.min(allocation, demand);
  const priceInCents = Math.round(price * 100);
  return { sold, unsold: allocation - sold, proceeds: sold * priceInCents / 100 };
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const setup = readSetup();
  if (step === 0 && !setup.name) {
    byId('name').setCustomValidity('Enter a token name.');
    byId('name').reportValidity();
    return;
  }
  if (step === 0) byId('allocation').max = setup.supply;
  if (step === 1) byId('review').textContent = reviewText(setup);
  if (step === 2) {
    const result = simulate(setup);
    byId('results').textContent = [
      `Tokens sold: ${number.format(result.sold)} ${setup.symbol}`,
      `Offered tokens left unsold: ${number.format(result.unsold)}`,
      `Mock proceeds: ${number.format(result.proceeds)} credits`,
    ].join('\n');
  }
  if (step < 3) showStep(step + 1);
});

byId('name').addEventListener('input', () => byId('name').setCustomValidity(''));
document.querySelectorAll('[data-back]').forEach((button) => {
  button.addEventListener('click', () => showStep(step - 1));
});
byId('example').addEventListener('click', () => {
  const example = { name: 'Rehearsal Token', symbol: 'RHR', supply: 10000, allocation: 3000, price: 0.25, demand: 4200 };
  for (const [id, value] of Object.entries(example)) byId(id).value = value;
  byId('name').setCustomValidity('');
});
byId('restart').addEventListener('click', () => {
  form.reset();
  byId('name').setCustomValidity('');
  showStep(0);
});
byId('share').addEventListener('click', async () => {
  const message = byId('review').textContent;
  try {
    await navigator.clipboard.writeText(message);
    if (step === 2) byId('copy-status').textContent = 'Copied. Paste it in your Telegram group and tag your Switch agent.';
  } catch {
    if (step !== 2) return;
    const manual = byId('manual');
    manual.value = message;
    manual.hidden = false;
    manual.select();
    byId('copy-status').textContent = 'Copy the selected text, then paste it in Telegram.';
  }
});
showStep(0, false);
