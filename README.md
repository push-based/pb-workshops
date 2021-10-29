# NX Intro

## Prepare

```shell
yarn install
```

## Create Libs

### Models

create models lib:

```shell
yarn nx g @nrwl/workspace:lib models --directory=shared
```

find & replace:

from: `from.*model.*` to: `from '@movies/shared/model';`

fix `libs/shared/models/index.ts`:

### Util

create util lib:

```shell
yarn nx g @nrwl/angular:lib util --directory=shared
```

from: `from.*utils.*` to: `from '@movies/shared/util'`

fix `libs/shared/util/index.ts`:

### data-access 

create data-access lib:

```shell
yarn nx g @nrwl/angular:lib data-access --directory=shared
```

find & replace:

from: `from.*data-access.*` to: `from '@movies/shared/data-access';`

fix `libs/shared/data-access/index.ts`:

## checkout solution

```shell
git checkout 06-01-nx-setup-solution
```

do a change in `models`

```shell
yarn nx affected:lint
```

## dependency graph

```shell
yarn dep-graph
```
