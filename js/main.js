//Stuff to run prior to pageload
installDeps();

//Stuff to run after DOM load
$(function(){
    //Works similar to namespace in C++
    //as in any property or method referenced here will
    //reference the variable containing the object
    //containing the property or method name
    //It's more obvious what the "with" keywords function is once you notice how and what its referencing
    //This also allows for this application to run separate from the other libraries present
    with (app) {
        //Launch game runtime
        start();
    }
})