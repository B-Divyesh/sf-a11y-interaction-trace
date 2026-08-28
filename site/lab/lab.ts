import '../main';

const dialog = document.querySelector<HTMLDialogElement>('#quick-edit')!;
const opener = document.querySelector<HTMLButtonElement>('#open-dialog')!;
const first = document.querySelector<HTMLInputElement>('#project-name')!;
const backgroundHelp = document.querySelector<HTMLAnchorElement>('#background-help')!;
const result = document.querySelector<HTMLElement>('#result')!;

opener.addEventListener('click', () => {
  // Intentionally non-modal: this is the seeded containment defect.
  dialog.show();
  first.focus();
  result.textContent = 'Dialog opened. Focus is on Project name.';
});

document.addEventListener('keydown', event => {
  if (!dialog.open) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    dialog.close('escape');
    return;
  }
  if (event.key === 'Tab' && event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    backgroundHelp.focus();
    result.textContent = 'Defect reproduced: focus escaped behind the dialog.';
  }
});

dialog.addEventListener('close', () => {
  opener.focus();
  if (dialog.returnValue !== 'escape') result.textContent = 'Dialog closed. Run the recipe again whenever you need a fresh trace.';
});
