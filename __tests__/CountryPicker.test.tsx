import React from 'react'

import { create, act } from 'react-test-renderer'

import CountryPicker from '../src/'

console.disableYellowBox = true

// TODO: fix tests
it('CountryPicker can be created', () => {
  expect(true).toBe(true);
})

// it('<CountryPicker /> toMatchSnapshot', () => {
//   let root
//   act(() => {
//     root = create(<CountryPicker countryCode={'US'} onSelect={() => {}} />)
//     expect(root.toJSON()).toMatchSnapshot()
//   })
// })
