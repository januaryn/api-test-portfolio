import { test, expect } from '@playwright/test';

const POKEAPI = 'https://pokeapi.co/api/v2/pokemon';

test('GET pikachu returns 200 and JSON', async ({ request }) => {
  const response = await request.get(`${POKEAPI}/pikachu`);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');
});

test('pikachu body has the expected values', async ({ request }) => {
  const response = await request.get(`${POKEAPI}/pikachu`);
  const pokemon = await response.json();

  expect(pokemon.id).toBe(25);
  expect(pokemon.name).toBe('pikachu');
  expect(Array.isArray(pokemon.types)).toBe(true);
  expect(pokemon.types.length).toBeGreaterThan(0);
});

test('pikachu is an electric type', async ({ request }) => {
  const response = await request.get(`${POKEAPI}/pikachu`);
  const pokemon = await response.json();

  const typeNames = pokemon.types.map((t: any) => t.type.name);
  expect(typeNames).toContain('electric');
});

test('unknown pokemon returns 404', async ({ request }) => {
  const response = await request.get(`${POKEAPI}/not-a-real-pokemon`);
  expect(response.status()).toBe(404);
});
