#include <stdio.h>

#define PI 3.14

int arr[3] = {1, 2, 3};

int add(int a, int b) {
    return a + b;
}

int main() {
    int   x = 10;
    float y = 2.5;
    char  c = 'A';
    const char* msg = "Hello, World!\n";

    printf("%s", msg);

    for (int i = 0; i < 3; i++) {
        printf("arr[%d] = %d\n", i, arr[i]);
    }

    /* Return success */
    return 0;
}