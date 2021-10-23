# PbWorkshops

## Exercises

### NX

#### init workspace & task-graph

* migrate to nx: npx nx init-workspace
* extract shared libraries
* use affected commands
* watch dependency graph

#### organize code with libs

* migrate libs
* setup module boundaries
* affected
* fix boundary errors

#### generators (schematics)

* implement custom schematic
* run custom schematic

#### continuous integration

* setup CI
* test CI

### ChangeDetection

**app.component**

* if activated, initial navigation will end up with empty movies

**app-shell.component**

* genres => movieService.getGenres

**movie-list-page.component**

* movies, title => bug onInit, CD won't work after OnPush

**movie-list.component**

* TODO: Check what happens when activate/deactivate here

### State Management

#### Local State

**app-shell.component**

* activeRoute$ | async pipe usage (ngFor)
  * shareReplay()
  * *ngIf= (o$ | async) as
* subscribe => genre = result

**move-list-page.component**

subscription handling:
 * unsubscribe 

manage list state:
  * loading, error, refresh 
    * start: https://stackblitz.com/edit/angular-ivy-xlcrcn
    * end: https://stackblitz.com/edit/angular-ivy-r84fjs
  * favorite (update per item)
 
pagination & filter:
  
#### Global State

**movie-state**

introduce `MovieDataState` 
* movies:
  * loading
  * error
  * re-fetch
  * search
  * filter
  * pagination
* genres:
  * share

**auth**

* introduce auth state
* implement login/logout flow, reflect in the UI
* implement auth interceptor

**dependency injection**
* introduce abstraction layer (port-pattern)

### Component Patterns

#### Content Projection

#### structural directives
* implement `isAuthed` Directive => structural directive

#### svg templates
* create nav-item-icon.component from svg in app-shell.component

#### lazy components
* https://stackblitz.com/edit/angular-ivy-aa8cxj
* https://stackblitz.com/edit/angular-ivy-mz8hsi

#### flattening operators
https://stackblitz.com/edit/rxjs-flattening-operators-example
