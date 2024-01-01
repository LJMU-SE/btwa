import sys, getopt
from vidstab.VidStab import VidStab

def main(argv):
    input_file = ''
    output_file = ''
    opts, args = getopt.getopt(argv,"hi:o:",["input=","output="])
    for opt, arg in opts:
        if opt == '-h':
            print ('stabilise.py -i <inputfile> -o <outputfile>')
            sys.exit()
        elif opt in ("-i", "--input"):
            input_file = arg
        elif opt in ("-o", "--output"):
            output_file = arg

    if(not input_file):
        raise Exception("\"--input\" is a required argument. Use \"-h\" for help.")
    
    if(not output_file):
        raise Exception("\"--output\" is a required argument")

    print("\nStabilising video at path:", input_file)

    border_type = "reflect"
    smoothing_window = 3

    stabiliser = VidStab()

    stabiliser.stabilize(input_path=input_file, output_path=output_file, smoothing_window=smoothing_window, border_type=border_type)

if __name__ == "__main__":
   main(sys.argv[1:])