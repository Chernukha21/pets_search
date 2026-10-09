import { expect } from 'chai';

const getSurnameWithInitials = (fullName) => {
  if (typeof fullName !== 'string') {
    throw new Error('Input must be a string');
  }
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) {
    throw new Error(
      'Full name must include at least a surname and a first name'
    );
  }
  if (parts.length > 3) {
    throw new Error('Full name must include a maximum of 3 words');
  }
  const surname = parts[0];
  const initials = parts
    .slice(1)
    .map((name) => name[0]?.toUpperCase() + '.')
    .join('');
  return `${surname} ${initials}`;
};

describe('testing getSurnameWithInitials function', function () {
  it('For arg like "Прізвище Ім\'я Побатькові" should be output "Прізвище І.П." ', () => {
    expect(getSurnameWithInitials("Прізвище Ім'я Побатькові")).to.equal(
      'Прізвище І.П.'
    );
  });
  it('For arg like "Прізвище Ім\'я" should be output "Прізвище І." ', () => {
    expect(getSurnameWithInitials("Прізвище Ім'я")).to.equal('Прізвище І.');
    ``;
  });
  it('For arg with less spaces should trim them', () => {
    expect(
      getSurnameWithInitials("  Прізвище Ім'я Побатькові ").trim()
    ).to.equal('Прізвище І.П.');
  });
  it('For agrs not of type string', () => {
    expect(() =>
      getSurnameWithInitials({
        lastName: 'Прізвище',
        firstName: "Ім'я",
      })
    ).to.throw('Input must be a string');
  });
  it('For agrs with only one word', () => {
    expect(() => getSurnameWithInitials('Прізвище')).to.throw(
      'Full name must include at least a surname and a first name'
    );
  });
  it('throws when full name has more than three words', () => {
    expect(() =>
      getSurnameWithInitials('Іваненко Петро Сергійович BlaBlaBla')
    ).to.throw('Full name must include a maximum of 3 words');
  });
});
