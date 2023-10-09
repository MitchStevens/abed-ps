

# Getting started

Install npm deps:
`npm install`

Build guitar app
`npm run build`


Use this command to install dev deps locally (for dev usage only):
`cat ./package.json | jq '.devDependencies | keys[] as $k | "\($k)@\(.[$k])"' | xargs -t npm install -g`


# TODO


## performance tests
- what is the most complicated board you can imagine?
- how many basic piece evals can we do per second?

## SOVL
- how does the 
- click and drag to create lines, click and 

## graphics
- make pictures of all the components with spcifcation
- how do the componets cohere?
- implement at the END
- add markdown to dialogue  <kbd> tags are cool!

## dialogues
- what do these characters WANT?
- 

# user feedback system
- what do you want user to see
- how do you grab user focus?
- add better static description
- mouse over text
    - tell player what pieces do what
- then implement
- then add that to tutorial suite
- preempt user mistakes

## operations:
    - visual: pay attention to this div!
    - textual: interupt chat
